const axios = require('axios');
const xml2js = require('xml2js');

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object') return value._ || fallback;
  return fallback;
}

function extractYear(article) {
  const medline = article?.MedlineCitation?.Article;
  const articleDate = toArray(medline?.ArticleDate)[0];
  const pubDate = medline?.Journal?.JournalIssue?.PubDate;
  const medlineDate = getText(pubDate?.MedlineDate, '');

  if (getText(articleDate?.Year, '')) return getText(articleDate.Year, 'N/A');
  if (getText(pubDate?.Year, '')) return getText(pubDate.Year, 'N/A');

  const medlineMatch = medlineDate.match(/\b(19|20)\d{2}\b/);
  return medlineMatch ? medlineMatch[0] : 'N/A';
}

async function fetchPubMedArticles(searchQuery, maxResults = 80) {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${searchQuery}&retmax=${maxResults}&sort=pub+date&retmode=json`;
    const searchResponse = await axios.get(searchUrl, { timeout: 30000 });
    const idList = searchResponse.data?.esearchresult?.idlist || [];

    if (!idList.length) {
      return [];
    }

    const ids = idList.join(',');
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=xml`;
    const fetchResponse = await axios.get(fetchUrl, { timeout: 30000 });
    const parsed = await xml2js.parseStringPromise(fetchResponse.data, { explicitArray: false });
    const articles = toArray(parsed?.PubmedArticleSet?.PubmedArticle);

    return articles.map((article) => {
      const citation = article?.MedlineCitation || {};
      const medlineArticle = citation.Article || {};
      const authorList = toArray(medlineArticle?.AuthorList?.Author);
      const abstractParts = toArray(medlineArticle?.Abstract?.AbstractText);
      const pmid = getText(citation.PMID, 'Unknown PMID');

      const title = getText(medlineArticle.ArticleTitle, 'Untitled article');
      let abstract = abstractParts.length
        ? abstractParts.map((part) => getText(part, '')).filter(Boolean).join(' ')
        : 'No abstract available';

      // Strip any HTML tags that may appear in PubMed abstracts
      if (abstract && typeof abstract === 'string') {
        abstract = abstract
          .replace(/<[^>]*>/g, ' ')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      const authors = authorList.length
        ? authorList
          .slice(0, 3)
          .map((author) => {
            const collective = getText(author.CollectiveName, '');
            if (collective) return collective;
            const lastName = getText(author.LastName, '');
            const initials = getText(author.Initials, '');
            const fullName = `${lastName} ${initials}`.trim();
            return fullName || getText(author.ForeName, '');
          })
          .filter(Boolean)
          .join(', ')
        : 'Unknown authors';

      return {
        title,
        abstract,
        authors: authors || 'Unknown authors',
        year: extractYear(article),
        pmid,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
        source: 'PubMed'
      };
    }).filter((article) => article.title && article.title.trim().length > 0);
  } catch (error) {
    console.error('PubMed fetch failed:', error.message);
    return [];
  }
}

module.exports = { fetchPubMedArticles };
