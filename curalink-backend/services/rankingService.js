const { INTENT_KEYWORDS } = require('../utils/queryExpander');

const COMMON_DISEASE_PATTERNS = {
  'brain cancer': { keywords: ['brain cancer'], types: [], synonyms: ['glioblastoma', 'brain tumor', 'GBM', 'astrocytoma', 'glioma'] },
  'lung cancer': { keywords: ['lung cancer'], types: [], synonyms: ['NSCLC', 'SCLC', 'non small cell lung cancer', 'small cell lung cancer'] },
  'breast cancer': { keywords: ['breast cancer'], types: [], synonyms: ['TNBC', 'triple negative breast cancer'] },
  'prostate cancer': { keywords: ['prostate cancer'], types: [], synonyms: ['PCA', 'prostatic carcinoma'] },
  'diabetes': { keywords: ['diabetes'], types: ['type 1', 'type 2'], synonyms: ['T2DM', 'insulin', 'GLP-1', 'SGLT2'] },
  'alzheimer': { keywords: ["alzheimer's", 'alzheimer'], types: [], synonyms: ['amyloid beta', 'tau', 'dementia'] },
  'parkinson': { keywords: ["parkinson's", 'parkinson'], types: [], synonyms: ['dopamine', 'alpha-synuclein'] },
  'heart disease': { keywords: ['heart disease', 'cardiovascular disease'], types: [], synonyms: ['CAD', 'coronary artery disease', 'heart failure', 'cardio'] },
  'depression': { keywords: ['depression'], types: [], synonyms: ['MDD', 'major depressive disorder'] }
};

const DRUG_KEYWORDS = ['GLP-1', 'SGLT2', 'EGFR', 'ALK', 'KRAS', 'PD-1', 'PD-L1', 'checkpoint inhibitor', 'immunotherapy', 'targeted therapy', 'drug', 'medication'];
const TRIAL_KEYWORDS = ['clinical trial', 'trial', 'randomized', 'randomized controlled trial', 'RCT', 'phase', 'efficacy', 'double-blind'];
const DEPRIORITIZE_KEYWORDS = ['CBT', 'psycho-social', 'psychosocial', 'caregiver', 'lifestyle', 'observational'];
const UNRELATED_DOMAINS = ['dental', 'dentistry', 'orthopedic', 'arthritis', 'microbiota', 'rare disease', 'turner', 'klinefelter', 'neurological'];
const DISEASE_EXCLUSION_WORDS = ['diabetes', 'cardio', 'stroke', 'arthritis', 'infection', 'dental', 'orthopedic'];
const TREATMENT_KEYWORDS = ['treatment', 'therapy', 'drug', 'inhibitor', 'clinical trial', 'phase', 'trial', 'intervention'];
const TREATMENT_BOOST_WORDS = ['randomized', 'phase 2', 'phase 3', 'double blind', 'double-blind', 'efficacy'];
const TREATMENT_EXCLUDE_WORDS = ['prognosis', 'survival analysis', 'epidemiology', 'inequality', 'risk factor', 'biomarker', 'frailty', 'diagnosis'];

const STUDY_TYPE_WEIGHTS = {
  'phase 3': 10,
  'phase iii': 10,
  'phase 2': 10,
  'phase ii': 10,
  'randomized controlled trial':10,
  'rct':10,
  'double-blind':10,
  'meta-analysis':6,
  'systematic review':6,
  'observational':3
};

function extractDiseaseComponents(disease) {
  const lower = String(disease || '').toLowerCase();
  let components = { keywords: [], types: [], synonyms: [], full: disease };

  for (const [key, data] of Object.entries(COMMON_DISEASE_PATTERNS)) {
    if (lower.includes(key)) {
      components.keywords = data.keywords;
      components.types = data.types;
      components.synonyms = data.synonyms;
      components.full = key;
      break;
    }
  }

  if (components.keywords.length === 0) {
    components.keywords = [lower];
    components.full = disease;
  }

  return components;
}

function isTreatmentIntent(query) {
  const lower = String(query || '').toLowerCase();
  const treatmentTriggers = ['treatment', 'therapy', 'drug', 'management', 'latest treatment'];
  for (const trigger of treatmentTriggers) {
    if (lower.includes(trigger)) {
      return true;
    }
  }
  return false;
}

function strictPublicationFilter(article, diseaseInfo, isTreatmentMode) {
  if (!diseaseInfo.detected) {
    return { keep: true, reason: 'no disease detected' };
  }

  const titleLower = (article.title || '').toLowerCase();
  const abstractLower = (article.abstract || '').toLowerCase();
  const fullTextLower = titleLower + ' ' + abstractLower;
  const components = extractDiseaseComponents(diseaseInfo.disease);

  let hasDiseaseInTitle = false;
  for (const kw of components.keywords) {
    if (titleLower.includes(kw)) {
      hasDiseaseInTitle = true;
      break;
    }
  }
  if (!hasDiseaseInTitle) {
    for (const syn of components.synonyms) {
      if (titleLower.includes(syn.toLowerCase())) {
        hasDiseaseInTitle = true;
        break;
      }
    }
  }
  if (!hasDiseaseInTitle) {
    return { keep: false, reason: 'disease not in title' };
  }

  if (isTreatmentMode) {
  let hasTreatmentKeyword = false;

  for (const kw of ['treatment', 'therapy', 'drug', 'inhibitor', 'immunotherapy', 'chemotherapy']) {
    if (titleLower.includes(kw)) {
      hasTreatmentKeyword = true;
      break;
    }
  }
    if (!hasTreatmentKeyword) {
      return { keep: false, reason: 'treatment mode: no treatment keyword' };
    }

    for (const kw of TREATMENT_EXCLUDE_WORDS) {
      if (fullTextLower.includes(kw)) {
        return { keep: false, reason: `treatment mode: excluded word "${kw}"` };
      }
    }
  }

  for (const word of DISEASE_EXCLUSION_WORDS) {
    const wordLower = word.toLowerCase();
    if (fullTextLower.includes(wordLower)) {
      let isTarget = false;
      for (const kw of components.keywords) {
        if (kw.includes(wordLower)) {
          isTarget = true;
          break;
        }
      }
      if (!isTarget) {
        return { keep: false, reason: `contains unrelated word: ${word}` };
      }
    }
  }

  for (const kw of UNRELATED_DOMAINS) {
    if (fullTextLower.includes(kw)) {
      return { keep: false, reason: `contains unrelated domain: ${kw}` };
    }
  }

  return { keep: true, reason: 'strict filter passed' };
}

function calculatePublicationScore(article, diseaseInfo, intents, isTrialsIntent, isTreatmentIntent, isTreatmentMode) {
  const titleLower = (article.title || '').toLowerCase();
  const abstractLower = (article.abstract || '').toLowerCase();
  const fullTextLower = titleLower + ' ' + abstractLower;
  const yearNum = parseInt(article.year) || 2000;
  const components = extractDiseaseComponents(diseaseInfo.disease);

  let score = 0;

  for (const kw of components.keywords) {
    if (titleLower.includes(kw)) {
      score +=10;
      break;
    }
  }
  for (const syn of components.synonyms) {
    if (titleLower.includes(syn.toLowerCase())) {
      score +=5;
      break;
    }
  }
  for (const kw of components.keywords) {
    if (abstractLower.includes(kw)) {
      score +=5;
      break;
    }
  }

  for (const intent of intents) {
    const keywords = INTENT_KEYWORDS[intent] || [];
    for (const kw of keywords) {
      if (fullTextLower.includes(kw.toLowerCase())) {
        score +=8;
        break;
      }
    }
  }

  let studyTypeWeight = 0;
  for (const [type, s] of Object.entries(STUDY_TYPE_WEIGHTS)) {
    if (fullTextLower.includes(type)) {
      studyTypeWeight = Math.max(studyTypeWeight, s);
    }
  }
  score += studyTypeWeight;

  for (const kw of ['in vitro', 'mouse', 'rat', 'simulation', 'review of mechanism', 'in-vitro']) {
    if (fullTextLower.includes(kw)) {
      score -=6;
    }
  }

  if (isTreatmentMode) {
    for (const kw of TREATMENT_KEYWORDS) {
      if (titleLower.includes(kw)) {
        score +=10;
        break;
      }
    }
    for (const kw of TREATMENT_BOOST_WORDS) {
      if (fullTextLower.includes(kw)) {
        score +=8;
        break;
      }
    }
    for (const kw of TREATMENT_EXCLUDE_WORDS) {
      if (fullTextLower.includes(kw)) {
        score -=8;
      }
    }
  }

  if (isTrialsIntent) {
    for (const kw of DRUG_KEYWORDS) {
      if (fullTextLower.includes(kw.toLowerCase())) {
        score +=4;
        break;
      }
    }
  }

  if (isTreatmentIntent) {
    for (const kw of DRUG_KEYWORDS) {
      if (fullTextLower.includes(kw.toLowerCase())) {
        score +=6;
        break;
      }
    }
  }

  if (yearNum >=2023) {
    score +=3;
  }

  if (article.source === 'PubMed') {
    score +=2;
  }

  return score;
}

function strictTrialFilter(trial, diseaseInfo) {
  if (!diseaseInfo.detected) {
    return { keep: true, reason: 'no disease detected' };
  }

  const titleLower = (trial.title || '').toLowerCase();
  const conditionLower = (trial.condition || '').toLowerCase();
  const fullTextLower = titleLower + ' ' + conditionLower;
  const components = extractDiseaseComponents(diseaseInfo.disease);

  let hasDiseaseInTitle = false;
  for (const kw of components.keywords) {
    if (titleLower.includes(kw)) {
      hasDiseaseInTitle = true;
      break;
    }
  }
  if (!hasDiseaseInTitle) {
    for (const syn of components.synonyms) {
      if (titleLower.includes(syn.toLowerCase())) {
        hasDiseaseInTitle = true;
        break;
      }
    }
  }
  if (!hasDiseaseInTitle) {
    return { keep: false, reason: 'disease not in trial title' };
  }

  for (const kw of UNRELATED_DOMAINS) {
    if (fullTextLower.includes(kw)) {
      return { keep: false, reason: `contains unrelated domain: ${kw}` };
    }
  }

  return { keep: true, reason: 'strict filter passed' };
}

function calculateTrialScore(trial, diseaseInfo) {
  const titleLower = (trial.title || '').toLowerCase();
  const fullTextLower = titleLower + ' ' + ((trial.condition || '') + ' ' + (trial.description || '')).toLowerCase();
  const statusUpper = (trial.status || '').toUpperCase();
  const phaseLower = (trial.phase || '').toLowerCase();
  const yearNum = trial.startDate ? parseInt(trial.startDate.split('-')[0]) : 2000;

  let score = 0;
  const components = extractDiseaseComponents(diseaseInfo.disease);

  for (const kw of components.keywords) {
    if (titleLower.includes(kw)) {
      score +=5; break;
    }
  }

  if (statusUpper.includes('RECRUITING') && !statusUpper.includes('NOT')) {
    score +=5;
  } else if (statusUpper.includes('ACTIVE')) {
    score +=3;
  } else if (statusUpper.includes('COMPLETED')) {
    score +=0;
  }

  if (phaseLower.includes('phase 3') || phaseLower.includes('phase iii')) {
    score +=5;
  } else if (phaseLower.includes('phase 2') || phaseLower.includes('phase ii')) {
    score +=3;
  } else if (phaseLower.includes('phase 1') || phaseLower.includes('phase i')) {
    score +=1;
  }

  const boostKws = ['randomized', 'double blind', 'double-blind', 'efficacy'];
  for (const kw of boostKws) {
    if (fullTextLower.includes(kw)) {
      score +=2;
      break;
    }
  }

  if (yearNum >=2023) {
    score +=1;
  }

  return score;
}

function rankPublications(pubmedArticles, openAlexArticles, query, diseaseInfo, intents, isTreatmentIntentFlag, topN = 6) {
  const combined = [...pubmedArticles, ...openAlexArticles];
  const queryLower = String(query || '').toLowerCase();
  const isTrialsIntent = intents.includes('trials') || queryLower.includes('clinical trial');
  const isTreatmentMode = isTreatmentIntentFlag;

  console.log('[Ranking] Total retrieved:', combined.length);
  console.log('[Ranking] Treatment mode:', isTreatmentMode);

  const seen = new Map();
  const deduped = [];
  for (const article of combined) {
    const normalized = (article.title || '').toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    if (normalized.length <5) continue;
    if (!seen.has(normalized)) {
      seen.set(normalized, true);
      deduped.push(article);
    }
  }
  console.log('[Ranking] After dedup:', deduped.length);

  let filtered = [];
  for (const article of deduped) {
    const filterResult = strictPublicationFilter(article, diseaseInfo, isTreatmentMode);
    if (filterResult.keep) {
      filtered.push(article);
    } else {
      console.log('[Ranking] Rejected pub:', article.title?.substring(0,50), '→', filterResult.reason);
    }
  }
  console.log('[Ranking] After strict filter:', filtered.length);

  let scored = filtered.map(article => {
    const score = calculatePublicationScore(article, diseaseInfo, intents, isTrialsIntent, isTreatmentIntentFlag, isTreatmentMode);
    return { ...article, _score: score };
  });

  scored = scored.filter(a => a._score >=8);
  scored.sort((a,b) => b._score - a._score);

  console.log('[Ranking] After scoring:', scored.length);
  console.log('[Ranking] Final selected:', scored.slice(0, topN).map(a => ({ title: a.title, score: a._score })));

  const final = scored.slice(0, topN).map(({ _score, ...article }) => article);
  return final;
}

function rankClinicalTrials(trials, diseaseInfo, topN = 5) {
  if (!diseaseInfo.detected) {
    return trials.slice(0, topN);
  }

  console.log('[Ranking Trials] Total retrieved:', trials.length);

  let filtered = [];
  for (const trial of trials) {
    const filterResult = strictTrialFilter(trial, diseaseInfo);
    if (filterResult.keep) {
      filtered.push(trial);
    } else {
      console.log('[Ranking Trials] Rejected trial:', trial.title?.substring(0,50), '→', filterResult.reason);
    }
  }
  console.log('[Ranking Trials] After strict filter:', filtered.length);

  let scored = filtered.map(trial => {
    const score = calculateTrialScore(trial, diseaseInfo);
    return { ...trial, _score: score, startYear: trial.startDate ? parseInt(trial.startDate.split('-')[0]) : 2000 };
  });

  scored.sort((a,b) => {
    if (b._score !== a._score) return b._score - a._score;
    return b.startYear - a.startYear;
  });

  const final = scored.slice(0, topN).map(({ _score, startYear, ...t }) => t);
  console.log('[Ranking Trials] Final selected:', final.length);
  return final;
}

module.exports = {
  rankPublications,
  rankClinicalTrials
};
