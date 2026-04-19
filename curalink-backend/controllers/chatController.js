const crypto = require('crypto');
const { expandQuery, buildPubMedSearchTerm, buildOpenAlexSearchTerm, resolveDiseaseContext } = require('../utils/queryExpander');
const { fetchPubMedArticles } = require('../services/pubmedService');
const { fetchOpenAlexArticles } = require('../services/openAlexService');
const { fetchClinicalTrials } = require('../services/clinicalTrialsService');
const { rankPublications, rankClinicalTrials } = require('../services/rankingService');
const { generateMedicalResponse, generateGeneralHealthResponse } = require('../services/llmService');

let Conversation;
try {
  Conversation = require('../models/Conversation');
} catch (e) {
  console.log('Conversation model not available');
}

// In-memory session store as fallback when MongoDB is unavailable
const sessionStore = new Map();

function getSession(sessionId) {
  return sessionStore.get(sessionId) || {
    sessionId,
    messages: [],
    userContext: {}
  };
}

function saveSession(sessionId, data) {
  sessionStore.set(sessionId, data);
}

async function handleChat(req, res) {
  const startTime = Date.now();

  try {
    const {
      userMessage,
      disease = '',
      patientName = '',
      location = ''
    } = req.body;

    let { sessionId } = req.body;

    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ error: 'userMessage is required' });
    }

    // ==============================================
    // HARD GATE: Only retrieve if query EXPLICITLY contains disease keywords
    // ==============================================
    function shouldDoRetrieval(query) {
      const diseaseKeywords = [
        "cancer", "diabetes", "alzheimer", "parkinson",
        "tumor", "disease", "syndrome", "infection"
      ];
      const lower = query.toLowerCase();
      return diseaseKeywords.some(d => lower.includes(d));
    }

    // STRICT GATE: If query doesn't mention disease explicitly, bypass retrieval
    if (!shouldDoRetrieval(userMessage)) {
      console.log('[HARD GATE] Query has no explicit disease keyword - returning general guidance');
      const generalResponse = `## 💡 General Health Guidance

This question is general health-related and does not require medical research retrieval.

Here are general, evidence-based points:

1. **Vitamin and Supplement Use**:
   - Vitamin D can be helpful if you have a confirmed deficiency
   - Excess intake of fat-soluble vitamins (A, D, E, K) can lead to toxicity
   - Dosage should always be guided by a qualified healthcare professional

2. **Important Reminders**:
   - Do not self-medicate
   - Consider a blood test to check Vitamin D levels if you have concerns
   - Always consult a healthcare professional before starting any new supplement
   - Individual health needs vary, so personalized advice is key

Always consult a qualified healthcare professional before making any changes to your health routine.`;

      return res.json({
        success: true,
        response: generalResponse,
        model: 'Curalink General Health Guidance',
        publications: [],
        clinicalTrials: [],
        sourcesUsed: [],
        sessionId
      });
    }

    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    // Load conversation (try MongoDB first, then memory)
    let conversation;
    let usingMongoDB = false;

    if (Conversation) {
      try {
        conversation = await Conversation.findOne({ sessionId });
        if (!conversation) {
          conversation = new Conversation({ sessionId, messages: [], userContext: {} });
        }
        usingMongoDB = true;
      } catch (dbErr) {
        console.log('DB lookup failed, using memory store');
        const memData = getSession(sessionId);
        conversation = memData;
      }
    } else {
      const memData = getSession(sessionId);
      conversation = memData;
    }

    // Update context from request
    if (disease) conversation.userContext.disease = disease;
    if (patientName) conversation.userContext.patientName = patientName;
    if (location) conversation.userContext.location = location;

    const previousDisease = conversation.userContext.disease || '';
    const effectiveDisease = resolveDiseaseContext(userMessage, previousDisease) || '';
    
    // Update user context only if we found a new disease
    if (effectiveDisease && effectiveDisease !== previousDisease) {
      conversation.userContext.disease = effectiveDisease;
    }

    console.log(`[Chat] session=${sessionId.substring(0, 8)}... disease="${effectiveDisease}" query="${userMessage.substring(0, 60)}"`);

    // Add user message
    conversation.messages.push({ role: 'user', content: userMessage, timestamp: new Date() });

    // Retrieval decision - at this point we know query has explicit disease keyword
    const messageLength = userMessage.trim().length;
    const hasDisease = effectiveDisease.length > 0;
    const isShortAck = messageLength < 8 && !userMessage.match(/treat|trial|research|study|drug|cancer|disease|symptom|diagnos/i);
    const hasResearchIntent = userMessage.match(/treat|therap|trial|research|study|drug|latest|recent|clinical|symptom|diagnos|cure|manag|prevent|cause|risk|progress|outcome|survival/i);
    
    const isFollowUp = conversation.messages.length > 2;
    const needsRetrieval = !isShortAck && (hasResearchIntent || isFollowUp || hasDisease || messageLength > 15);
    
    console.log(`[Decision] needsRetrieval=${needsRetrieval} hasDisease=${hasDisease} isFollowUp=${isFollowUp}`);

    let rankedPublications = [];
    let rankedTrials = [];
    let expanded = null;

    if (needsRetrieval) {
      console.log(`[Research] Starting retrieval for: disease="${effectiveDisease}", query="${userMessage}"`);

      try {
        expanded = expandQuery({
          disease: effectiveDisease,
          query: userMessage,
          location: conversation.userContext.location || ''
        });

        console.log('[Research] Expanded:', expanded);

        const pubmedTerm = buildPubMedSearchTerm(expanded);
        const openAlexTerm = buildOpenAlexSearchTerm(expanded);

        console.log('[Research] PubMed term:', pubmedTerm);
        console.log('[Research] OpenAlex term:', openAlexTerm);

        const [pubmedResults, openAlexResults, trialsResults] = await Promise.all([
          fetchPubMedArticles(pubmedTerm, 80).catch(e => { console.error('PubMed error:', e.message); return []; }),
          fetchOpenAlexArticles(openAlexTerm, 80).catch(e => { console.error('OpenAlex error:', e.message); return []; }),
          fetchClinicalTrials(expanded.clinicalTrialsQuery, 40).catch(e => { console.error('Trials error:', e.message); return []; })
        ]);

        console.log('[Research] PubMed results sample (first 2):', pubmedResults.slice(0,2).map(p => ({title:p.title, year:p.year, source:p.source})));
        console.log('[Research] OpenAlex results sample (first 2):', openAlexResults.slice(0,2).map(p => ({title:p.title, year:p.year, source:p.source})));
        console.log('[Research] Raw counts:', {pubmed: pubmedResults.length, openAlex: openAlexResults.length, trials: trialsResults.length});
        
        rankedPublications = rankPublications(
          pubmedResults, 
          openAlexResults, 
          userMessage, 
          expanded.diseaseInfo, 
          expanded.intents, 
          expanded.isTreatmentIntent, 
          expanded.entity,
          6
          );
        rankedTrials = rankClinicalTrials(
          trialsResults, 
          expanded.diseaseInfo, 
          6
        );

        console.log('[Research] Final ranked counts:', {pubs: rankedPublications.length, trials: rankedTrials.length});
      } catch (retrievalError) {
        console.error('[Research] Retrieval error:', retrievalError.message);
      }
    }

    // Get conversation history for LLM context
    const recentHistory = conversation.messages.slice(-8);

    // Generate LLM response
    console.log('[LLM] Generating response...');
    let llmResult;

    llmResult = await generateMedicalResponse(
      userMessage,
      effectiveDisease,
      rankedPublications,
      rankedTrials,
      recentHistory,
      expanded ? expanded.intents : [],
      expanded ? expanded.isAdviceQuery : false,
      expanded ? expanded.entity : null
    );
    console.log(`[LLM] Model used: ${llmResult.model}`);

    // Add assistant response to conversation
    conversation.messages.push({
      role: 'assistant',
      content: llmResult.response,
      timestamp: new Date()
    });

    // Keep last 20 messages
    if (conversation.messages.length > 20) {
      conversation.messages = conversation.messages.slice(-20);
    }

    // Save conversation
    if (usingMongoDB && Conversation) {
      try {
        await conversation.save();
      } catch (saveErr) {
        console.log('DB save failed, saved to memory');
        saveSession(sessionId, conversation);
      }
    } else {
      saveSession(sessionId, conversation);
    }

    const elapsed = Date.now() - startTime;
    console.log(`[Chat] Completed in ${elapsed}ms`);

    res.json({
      sessionId,
      response: llmResult.response,
      publications: rankedPublications,
      clinicalTrials: rankedTrials,
      model: llmResult.model,
      sourcesUsed: llmResult.sourcesUsed || [],
      userContext: conversation.userContext,
      stats: {
        publicationsFound: rankedPublications.length,
        trialsFound: rankedTrials.length,
        responseTimeMs: elapsed
      }
    });

  } catch (error) {
    console.error('[Chat] Fatal error:', error);
    res.status(500).json({
      error: error.message,
      sessionId: req.body.sessionId || null
    });
  }
}

async function getHistory(req, res) {
  try {
    const { sessionId } = req.params;

    let conversation;
    if (Conversation) {
      conversation = await Conversation.findOne({ sessionId });
    }

    if (!conversation) {
      conversation = sessionStore.get(sessionId);
    }

    if (!conversation) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      messages: conversation.messages,
      userContext: conversation.userContext
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { handleChat, getHistory };