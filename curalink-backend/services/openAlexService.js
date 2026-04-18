const axios = require('axios');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function reconstructAbstract(abstractInvertedIndex) {
  let abstract = 'No abstract available';
  try {
    if (abstractInvertedIndex && typeof abstractInvertedIndex === 'object') {
      const wordPositions = [];
      for (const [word, positions] of Object.entries(abstractInvertedIndex)) {
        for (const pos of positions) {
          wordPositions.push({ word, pos });
        }
      }
      wordPositions.sort((a, b) => a.pos - b.pos);
      const reconstructed = wordPositions.map(wp => wp.word).join(' ');
      if (reconstructed.length > 30) {
        abstract = reconstructed;
      }
    }
  } catch (e) {
    abstract = 'No abstract available';
  }
  return abstract;
}

async function fetchOpenAlexArticles(searchQuery, totalResults = 80) {
  try {
    const pagesToFetch = Math.min(Math.ceil(totalResults / 25), 4);
    const collected = [];

    for (let page = 1; page <= pagesToFetch; page += 1) {
      const url = `https://api.openalex.org/works?search=${encodeURIComponent(searchQuery)}&per_page=25&page=${page}&sort=relevance_score:desc&filter=from_publication_date:2018-01-01`;
      const response = await axios.get(url, { timeout: 30000 });
      const works = response.data?.results || [];

      for (const work of works) {
        const authorships = Array.isArray(work.authorships) ? work.authorships : [];
        const authors = authorships.length
          ? authorships
            .slice(0, 3)
            .map((authorship) => authorship?.author?.display_name || '')
            .filter(Boolean)
            .join(', ')
          : 'Unknown authors';

        collected.push({
          title: work.title || work.display_name || 'Untitled article',
          abstract: reconstructAbstract(work.abstract_inverted_index),
          authors: authors || 'Unknown authors',
          year: work.publication_year ? String(work.publication_year) : 'N/A',
          url: work.primary_location?.landing_page_url || work.doi || work.id || 'https://openalex.org',
          source: 'OpenAlex'
        });
      }

      if (page < pagesToFetch) {
        await sleep(200);
      }
    }

    const seenTitles = new Set();
    const deduplicated = [];

    for (const article of collected) {
      const normalizedTitle = (article.title || '').trim().toLowerCase();
      if (!normalizedTitle || seenTitles.has(normalizedTitle)) {
        continue;
      }

      seenTitles.add(normalizedTitle);
      deduplicated.push(article);
    }

    return deduplicated;
  } catch (error) {
    console.error('OpenAlex fetch failed:', error.message);
    return [];
  }
}

module.exports = { fetchOpenAlexArticles };
