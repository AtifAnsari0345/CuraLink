const axios = require('axios');

const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
const HF_API_KEY = process.env.HF_API_KEY || "";
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

function buildPrompt(userQuery, disease, publications, clinicalTrials, conversationHistory) {
  const pubContext = publications.slice(0, 6).map((pub, i) =>
    `[${i + 1}] "${pub.title}" (${pub.year}) by ${pub.authors}\nAbstract: ${(pub.abstract || '').substring(0, 250)}...\nURL: ${pub.url}`
  ).join('\n\n');

  const trialContext = clinicalTrials.slice(0, 4).map((trial, i) =>
    `[T${i + 1}] "${trial.title}"\nStatus: ${trial.status} | Phase: ${trial.phase}\nLocation: ${trial.locations}\nContact: ${trial.contact}`
  ).join('\n\n');

  const historyContext = conversationHistory.slice(-4).map(m =>
    `${m.role === 'user' ? 'Patient' : 'Curalink'}: ${m.content.substring(0, 200)}`
  ).join('\n');

  return `<s>[INST] You are Curalink, an expert AI medical research assistant. Provide structured, evidence-based responses using ONLY the research sources provided below. Always cite sources by number like [1], [2]. Never hallucinate facts.

Disease/Condition: ${disease || 'General'}
Patient Question: ${userQuery}

${historyContext ? `Previous conversation:\n${historyContext}\n` : ''}

RESEARCH PUBLICATIONS:
${pubContext || 'No publications retrieved for this query.'}

CLINICAL TRIALS:
${trialContext || 'No clinical trials retrieved.'}

Please provide a well-structured, easy-to-read response. Use this EXACT format:

## 🔬 Condition Overview
Write 2-3 sentences giving a clear, accurate overview specifically about the user's query.

---

## 📊 Research Insights

For each publication, create a separate insight card like this:

**[1] [Paper Title]** *(Year, Source)*
*Authors: [authors]*
> Key Finding: [1-2 sentences explaining what this paper found and why it matters]
🔗 [Read Paper](url)

Each publication must be separated by a blank line.

---

## 🧪 Clinical Trials

For each trial, write:

**[Trial Name]**
- **Status:** [status] | **Phase:** [phase]
- **Location:** [location]
- **Contact:** [contact]
- 🔗 [View Trial](url)

---

## 💡 Key Takeaways
- [Specific insight 1 from the research above]
- [Specific insight 2]
- [Specific insight 3]
- Always consult a qualified medical professional before making health decisions

---

## 📚 Sources
- [1] [Title] — [Source] — [URL]
- [2] [Title] — [Source] — [URL]

Important:
- Answer specifically about the user's query, not their profile conditions
- Every publication must be on its own paragraph with a blank line before it
- Each bullet point must be on its own line
- No running text — proper markdown spacing throughout[/INST]`;
}

function generateStructuredFallback(userQuery, disease, publications, clinicalTrials, conversationHistory) {
  const queryLower = userQuery.toLowerCase();
  const actualCondition = userQuery;

  const pubInsights = publications.slice(0, 6).map((pub, i) => {
    const cleanAbstract = (pub.abstract || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const snippet = cleanAbstract.substring(0, 300);
    return `**[${i+1}] ${pub.title}** *(${pub.year}, ${pub.source})*
*Authors: ${pub.authors}*
> **Key Finding:** ${snippet}${cleanAbstract.length > 300 ? '...' : ''}
🔗 [Read Paper](${pub.url})`;
  }).join('\n\n');

  const trialSummaries = clinicalTrials.slice(0, 4).map((trial, i) => {
    return `**${trial.title}**
- **Status:** ${trial.status} | **Phase:** ${trial.phase}
- **Location:** ${trial.locations}
- **Contact:** ${trial.contact}
- 🔗 [View Trial](${trial.url})`;
  }).join('\n\n');

  const isAboutTreatment = queryLower.match(/treat|therap|medic|drug|cure|manag/);
  const isAboutTrials = queryLower.match(/trial|study|research|clinical/);
  const isAboutSymptoms = queryLower.match(/symptom|sign|diagnos|detect/);
  const isFollowUp = conversationHistory && conversationHistory.length > 2;

  let overviewContext = '';
  if (isAboutTreatment) {
    overviewContext = `Current treatment approaches for **${actualCondition}** are rapidly evolving. The latest evidence points toward precision medicine strategies, including targeted therapies and immunotherapy combinations, as key frontiers.`;
  } else if (isAboutTrials) {
    overviewContext = `Clinical trial activity for **${actualCondition}** reflects growing research momentum. Multiple trials across different phases are evaluating novel interventions, with several actively recruiting eligible participants.`;
  } else if (isAboutSymptoms) {
    overviewContext = `Understanding **${actualCondition}** symptomatology and early detection remains a critical research priority. The publications below reflect advances in diagnostic precision and biomarker discovery.`;
  } else {
    overviewContext = `Research on **${actualCondition}** is an active area of investigation. Our system retrieved ${publications.length} peer-reviewed publications and ${clinicalTrials.length} clinical trials from PubMed, OpenAlex, and ClinicalTrials.gov.`;
  }

  if (isFollowUp) {
    overviewContext = `Building on our previous discussion: ` + overviewContext;
  }

  const recruitingCount = clinicalTrials.filter(t => (t.status || '').toUpperCase().includes('RECRUITING') && !(t.status || '').toUpperCase().includes('NOT')).length;
  const recentPubs = publications.filter(p => parseInt(p.year) >= 2023).length;

  const aiInsights = [];
  if (publications.length > 0) {
    const lowerPubTexts = publications.map(p => (p.title + ' ' + (p.abstract || '')).toLowerCase());
    const hasGLP1 = lowerPubTexts.some(t => t.includes('glp-1') || t.includes('glp1'));
    const hasSGLT2 = lowerPubTexts.some(t => t.includes('sglt2'));
    const hasImmunotherapy = lowerPubTexts.some(t => t.includes('immunotherapy') || t.includes('pd-1') || t.includes('pd-l1'));
    const hasNonInsulin = lowerPubTexts.some(t => t.includes('non-insulin'));

    if (hasGLP1 || hasSGLT2) aiInsights.push('Most trials focus on GLP-1 receptor agonists and SGLT2 inhibitors');
    if (hasNonInsulin) aiInsights.push('Strong shift toward non-insulin therapies');
    if (hasImmunotherapy) aiInsights.push('Immunotherapy approaches are a growing area of research');
    if (publications.some(p => (p.abstract || '').toLowerCase().includes('phase 3') || (p.title || '').toLowerCase().includes('phase 3'))) {
      aiInsights.push('Phase 3 trials indicate near-market drugs');
    }
    if (lowerPubTexts.some(t => t.includes('cbt') || t.includes('psycho'))) {
      aiInsights.push('Behavioral interventions exist but are secondary');
    }
  }

  const takeaways = [
    `${publications.length} peer-reviewed publications were retrieved, with ${recentPubs} published in 2023 or later.`,
    `${clinicalTrials.length} clinical trials were found, including ${recruitingCount} that are actively recruiting.`,
    `The retrieved studies highlight current treatment directions, clinical activity, and practical follow-up areas for ${actualCondition}.`,
    'Always consult a qualified medical professional before making health decisions'
  ];

  return `## 🔬 Condition Overview
${overviewContext}

---

${aiInsights.length > 0 ? `## 🧠 AI Insights
${aiInsights.map(t => `- ${t}`).join('\n')}

---

` : ''}

## 📊 Research Insights

${pubInsights || '*No publications were retrieved. Please ensure a disease/condition is set in the sidebar and try a more specific query.*'}

---

## 🧪 Clinical Trials

${trialSummaries || '*No clinical trials found for this query. Try searching directly on `https://clinicaltrials.gov` .*'}

---

## 💡 Key Takeaways

${takeaways.map(t => `- ${t}`).join('\n')}

---

## 📚 Sources

${publications.slice(0, 6).map((p, i) => `- [${i+1}] ${p.title} — ${p.source} — ${p.url}`).join('\n')}`;
}

async function tryOllama(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory) {
  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: { temperature: 0.3, num_predict: 1200 }
      },
      { timeout: 60000 }
    );

    if (response.data && response.data.response) {
      return {
        response: response.data.response,
        model: 'Llama3.2 (Ollama Local)',
        sourcesUsed: publications.slice(0, 6).map(p => ({ title: p.title, url: p.url, source: p.source }))
      };
    }
  } catch (err) {
    console.log('Ollama failed:', err.message);
    throw err;
  }
}

async function tryOpenAI(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY.length < 10) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are Curalink, an expert AI medical research assistant. Provide structured, evidence-based responses using only the research sources provided. Always cite sources by number like [1], [2]. Never hallucinate facts.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1200
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 40000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].message) {
      return {
        response: response.data.choices[0].message.content,
        model: `${OPENAI_MODEL} (OpenAI)`,
        sourcesUsed: publications.slice(0, 6).map(p => ({ title: p.title, url: p.url, source: p.source }))
      };
    }
  } catch (err) {
    console.log('OpenAI failed:', err.message);
    throw err;
  }
}

async function tryHuggingFace(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory) {
  if (!HF_API_KEY || HF_API_KEY.length < 10) {
    throw new Error('HuggingFace API key not configured');
  }

  try {
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.3,
          return_full_text: false,
          do_sample: true
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 40000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return {
        response: response.data[0].generated_text,
        model: 'Mistral-7B-Instruct (HuggingFace)',
        sourcesUsed: publications.slice(0, 6).map(p => ({ title: p.title, url: p.url, source: p.source }))
      };
    }
  } catch (err) {
    console.log('HuggingFace failed:', err.message);
    throw err;
  }
}

async function generateMedicalResponse(userQuery, disease, publications, clinicalTrials, conversationHistory = [], intents, isAdviceQuery, entity) {
  const prompt = buildPrompt(userQuery, disease, publications, clinicalTrials, conversationHistory);

  let llmResult;

  try {
    llmResult = await tryOllama(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory);
  } catch (ollamaErr) {
    console.log('Falling back to OpenAI...');
    try {
      llmResult = await tryOpenAI(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory);
    } catch (openaiErr) {
      console.log('Falling back to HuggingFace...');
      try {
        llmResult = await tryHuggingFace(prompt, userQuery, disease, publications, clinicalTrials, conversationHistory);
      } catch (hfErr) {
        console.log('Falling back to structured fallback...');
        const fallbackResponse = generateStructuredFallback(userQuery, disease, publications, clinicalTrials, conversationHistory);
        llmResult = {
          response: fallbackResponse,
          model: 'Curalink Structured Engine (Research-Based)',
          sourcesUsed: publications.slice(0, 6).map(p => ({ title: p.title, url: p.url, source: p.source }))
        };
      }
    }
  }

  // Append safe guidance section if it's an advice query
  if (isAdviceQuery && entity) {
    const safeGuidance = `

---

## 💡 Guidance

- Research on **${entity}** in the context of **${disease || 'this condition'}** is still evolving and may be limited.
- It should not replace standard medical treatments.
- Effects can vary depending on individual conditions and medications.
- **Please consult a qualified healthcare professional before using ${entity}.**
`;
    llmResult.response = llmResult.response + safeGuidance;
  }

  return llmResult;
}

function generateGeneralHealthResponse(query) {
  const safeGuidance = `## 💡 General Health Guidance

This question is general health-related and not tied to a specific disease.

Here are general, evidence-based points to consider:

1. **Vitamin and Supplement Use**:
   - Supplements like Vitamin D can be beneficial in cases of confirmed deficiency
   - Excess intake of fat-soluble vitamins (A, D, E, K) can cause side effects
   - Always check with a healthcare provider before starting any new supplement

2. **Diet and Lifestyle**:
   - A balanced, varied diet is generally recommended for most people
   - Specific diets should be discussed with a healthcare provider or registered dietitian
   - Regular physical activity has numerous health benefits

3. **Important Reminder**:
   - Avoid self-diagnosis and self-medication
   - If you have specific concerns about a condition, consult a qualified healthcare professional
   - Individual health needs vary, so personalized advice is key

Always consult a qualified healthcare professional before making any changes to your health routine.`;

  return safeGuidance;
}

module.exports = { generateMedicalResponse, generateGeneralHealthResponse };
