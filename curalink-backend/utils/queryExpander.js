const INTENT_KEYWORDS = {
  treatment: ['treatment', 'therapy', 'drug', 'medication', 'clinical trial', 'immunotherapy', 'targeted therapy', 'chemotherapy', 'radiation', 'surgery', 'cure', 'efficacy', 'survival'],
  diagnosis: ['diagnosis', 'diagnostic', 'screening', 'detection', 'biomarker', 'test', 'imaging'],
  research: ['research', 'study', 'paper', 'publication', 'latest', 'recent', 'advance', 'progress', 'update'],
  symptoms: ['symptom', 'sign', 'manifestation', 'progression', 'severity', 'outcome'],
  trials: ['clinical trial', 'trial', 'randomized controlled trial', 'rct', 'phase', 'efficacy', 'intervention']
};

const ADVICE_QUERY_PATTERNS = [
  /can i/i,
  /should i/i,
  /is it safe/i,
  /is .* good/i,
  /can i use/i,
  /should i take/i,
  /can i follow/i,
  /is diet/i
];

const RECENCY_YEARS = ['2022', '2023', '2024', '2025'];
const RECENCY_BOOST = 2;

function extractEntity(query) {
  const cleaned = query
    .toLowerCase()
    .replace(/can i|should i|is it safe to|is it|is|are|do you think|can i use|should i take/gi, "")
    .replace(/\?/g, "")
    .trim();
  
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length === 0) return null;
  return words.slice(-5).join(" ");
}

function extractDisease(diseaseInput, queryInput) {
  const normalizedDisease = String(diseaseInput || '').trim();
  const normalizedQuery = String(queryInput || '').trim();
  
  if (normalizedDisease) {
    return {
      detected: true,
      disease: normalizedDisease,
      source: 'structured'
    };
  }

  const queryLower = normalizedQuery.toLowerCase();
  const commonDiseasePatterns = [
    /lung cancer/i,
    /diabetes/i,
    /alzheimer/i,
    /parkinson/i,
    /heart disease/i,
    /breast cancer/i,
    /depression/i,
    /cancer/i,
    /disease/i,
    /syndrome/i,
    /disorder/i
  ];

  for (const pattern of commonDiseasePatterns) {
    const match = normalizedQuery.match(pattern);
    if (match) {
      return {
        detected: true,
        disease: match[0],
        source: 'query'
      };
    }
  }

  return {
    detected: false,
    disease: '',
    source: 'none'
  };
}

function detectIntent(query) {
  const lower = String(query || '').toLowerCase();
  const matches = [];

  // Check for advice query first
  let isAdviceQuery = false;
  for (const pattern of ADVICE_QUERY_PATTERNS) {
    if (pattern.test(query)) {
      isAdviceQuery = true;
      break;
    }
  }

  if (isAdviceQuery) {
    matches.push('advice_query');
  }

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        matches.push(intent);
        break;
      }
    }
  }

  if (matches.length === 0) {
    return ['research'];
  }
  return matches;
}

function expandQuery({ disease = '', query = '', location = '' }) {
  const diseaseInfo = extractDisease(disease, query);
  const intents = detectIntent(query);
  const isTreatmentIntent = intents.includes('treatment');
  const isDiagnosisIntent = intents.includes('diagnosis');
  const isResearchIntent = intents.includes('research');
  const isSymptomsIntent = intents.includes('symptoms');
  const isTrialsIntent = intents.includes('trials') || query.toLowerCase().includes('clinical trial');
  const isAdviceQuery = intents.includes('advice_query');
  const entity = extractEntity(query);

  let effectiveDisease = diseaseInfo.disease || query;
  let pubmedParts = [];
  let openAlexParts = [];

  // Handle advice_query specifically
  if (isAdviceQuery && entity) {
    if (diseaseInfo.detected) {
      const adviceQuery = `${diseaseInfo.disease} ${entity} effectiveness safety clinical evidence treatment interaction`;
      pubmedParts.push(`"${diseaseInfo.disease}"`);
      pubmedParts.push(`"${entity}"`);
      pubmedParts.push('(effectiveness OR safety OR clinical evidence OR treatment OR interaction)');
      openAlexParts.push(diseaseInfo.disease, entity, 'effectiveness', 'safety', 'clinical', 'evidence', 'treatment', 'interaction');
    } else {
      const adviceQuery = `${entity} medical use effectiveness safety research`;
      pubmedParts.push(`"${entity}"`);
      pubmedParts.push('(medical use OR effectiveness OR safety OR research)');
      openAlexParts.push(entity, 'medical', 'use', 'effectiveness', 'safety', 'research');
    }
  } else {
    // Original expansion logic
    if (diseaseInfo.detected) {
      pubmedParts.push(`"${diseaseInfo.disease}"`);
      openAlexParts.push(diseaseInfo.disease);
    } else {
      pubmedParts.push(`"${query}"`);
      openAlexParts.push(query);
    }

    if (isTrialsIntent) {
      const trialKws = ['clinical trial', 'trial', 'randomized controlled trial', 'RCT', 'phase', 'efficacy', 'intervention'];
      const trialPart = trialKws.map(t => `"${t}"`).join(' OR ');
      pubmedParts.push(`(${trialPart})`);
      openAlexParts.push(...trialKws);
    } else if (isTreatmentIntent) {
      const treatmentKws = INTENT_KEYWORDS.treatment;
      const treatmentPart = treatmentKws.map(t => `"${t}"`).join(' OR ');
      pubmedParts.push(`(${treatmentPart})`);
      openAlexParts.push(...treatmentKws);
    } else if (isDiagnosisIntent) {
      const diagKws = INTENT_KEYWORDS.diagnosis;
      const diagPart = diagKws.map(d => `"${d}"`).join(' OR ');
      pubmedParts.push(`(${diagPart})`);
      openAlexParts.push(...diagKws);
    } else if (isResearchIntent) {
      const researchKws = INTENT_KEYWORDS.research;
      pubmedParts.push(`("${researchKws.join('" OR "')}")`);
      openAlexParts.push(...researchKws);
    }
  }

  const recencyPart = RECENCY_YEARS.map(y => `${y}[dp]`).join(' OR ');
  pubmedParts.push(`(${recencyPart})`);
  openAlexParts.push('2022 2023 2024 2025');

  const pubmedQuery = pubmedParts.join(' AND ');
  const openAlexQuery = [...new Set(openAlexParts)].join(' ');
  const clinicalTrialsQuery = effectiveDisease;

  console.log('[Query Expander] Input:', { disease, query });
  console.log('[Query Expander] Output:', {
    diseaseInfo,
    intents,
    isTreatmentIntent,
    isTrialsIntent,
    isAdviceQuery,
    entity,
    pubmedQuery,
    openAlexQuery,
    clinicalTrialsQuery
  });

  return {
    primaryQuery: pubmedQuery,
    openAlexQuery,
    clinicalTrialsQuery,
    diseaseInfo,
    intents,
    isTreatmentIntent,
    isDiagnosisIntent,
    isResearchIntent,
    isSymptomsIntent,
    isTrialsIntent,
    isAdviceQuery,
    entity
  };
}

function buildPubMedSearchTerm(expanded) {
  return encodeURIComponent(expanded.primaryQuery);
}

function buildOpenAlexSearchTerm(expanded) {
  return expanded.openAlexQuery;
}

function isGenericHealthQuery(query) {
  const genericPatterns = [
    /can i take/i,
    /should i take/i,
    /is it safe/i,
    /vitamin/i,
    /supplement/i,
    /diet/i,
    /food/i,
    /exercise/i
  ];
  return genericPatterns.some(pattern => pattern.test(query));
}

function resolveDiseaseContext(query, previousDisease) {
  const extracted = extractDisease('', query); // Pass empty disease input to extract from query
  
  if (extracted && extracted.detected) {
    return extracted.disease;
  }
  
  if (isGenericHealthQuery(query)) {
    return null;
  }
  
  if (query.length < 40 && previousDisease) {
    return previousDisease;
  }
  
  return null;
}

module.exports = {
  expandQuery,
  buildPubMedSearchTerm,
  buildOpenAlexSearchTerm,
  INTENT_KEYWORDS,
  isGenericHealthQuery,
  resolveDiseaseContext
};
