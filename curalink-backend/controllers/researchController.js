const { expandQuery, buildPubMedSearchTerm, buildOpenAlexSearchTerm } = require('../utils/queryExpander');
const { fetchPubMedArticles } = require('../services/pubmedService');
const { fetchOpenAlexArticles } = require('../services/openAlexService');
const { fetchClinicalTrials } = require('../services/clinicalTrialsService');
const { rankPublications, rankClinicalTrials } = require('../services/rankingService');

async function handleResearch(req, res) {
  try {
    const { disease, query, location } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: "Missing required field: query is mandatory." 
      });
    }

    const expandedResult = expandQuery({ disease, query, location });
    const pubmedTerm = buildPubMedSearchTerm(expandedResult);
    const openAlexTerm = buildOpenAlexSearchTerm(expandedResult);

    const [pubmedResults, openAlexResults, clinicalTrialsResults] = await Promise.all([
      fetchPubMedArticles(pubmedTerm, 80),
      fetchOpenAlexArticles(openAlexTerm, 80),
      fetchClinicalTrials(expandedResult.clinicalTrialsQuery, 40)
    ]);

    const rankedPublications = rankPublications(
      pubmedResults, 
      openAlexResults, 
      query, 
      expandedResult.diseaseInfo, 
      expandedResult.intents, 
      expandedResult.isTreatmentIntent, 
      6
    );

    const rankedTrials = rankClinicalTrials(
      clinicalTrialsResults, 
      expandedResult.diseaseInfo, 
      6
    );

    return res.status(200).json({
      success: true,
      query: {
        original: { disease, query, location },
        expanded: expandedResult.expandedTerms
      },
      results: {
        publications: rankedPublications,
        trials: rankedTrials
      },
      metadata: {
        pubmedCount: pubmedResults.length,
        openAlexCount: openAlexResults.length,
        trialsCount: clinicalTrialsResults.length
      }
    });

  } catch (error) {
    console.error("Research Orchestration Error:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing your research request.",
      details: error.message
    });
  }
}

module.exports = { handleResearch };