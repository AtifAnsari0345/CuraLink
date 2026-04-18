const INTENT_KEYWORDS = {
  treatment: ['treatment', 'therapy', 'drug', 'medication', 'clinical trial', 'immunotherapy', 'targeted therapy', 'chemotherapy', 'radiation', 'surgery', 'cure', 'efficacy', 'survival'],
  diagnosis: ['diagnosis', 'diagnostic', 'screening', 'detection', 'biomarker', 'test', 'imaging'],
  research: ['research', 'study', 'paper', 'publication', 'latest', 'recent', 'advance', 'progress', 'update'],
  symptoms: ['symptom', 'sign', 'manifestation', 'progression', 'severity', 'outcome'],
  trials: ['clinical trial', 'trial', 'randomized controlled trial', 'rct', 'phase', 'efficacy', 'intervention']
};

const RECENCY_YEARS = ['2022', '2023', '2024', '2025'];
const RECENCY_BOOST = 2;

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
  const effectiveDisease = diseaseInfo.disease || query;

  let pubmedParts = [];
  let openAlexParts = [];

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
    isTrialsIntent
  };
}

function buildPubMedSearchTerm(expanded) {
  return encodeURIComponent(expanded.primaryQuery);
}

function buildOpenAlexSearchTerm(expanded) {
  return expanded.openAlexQuery;
}

module.exports = {
  expandQuery,
  buildPubMedSearchTerm,
  buildOpenAlexSearchTerm,
  INTENT_KEYWORDS
};
