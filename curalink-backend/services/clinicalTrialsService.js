const axios = require('axios');

function truncate(text, maxLength) {
  const value = String(text || '').trim();
  if (!value) return 'Not specified';
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

function formatLocation(location) {
  const parts = [
    location?.facility,
    location?.city,
    location?.state,
    location?.country
  ].filter(Boolean);

  return parts.join(', ');
}

function formatContact(contact) {
  if (!contact) return 'Contact not available';

  const parts = [
    contact.name,
    contact.phone,
    contact.email
  ].filter(Boolean);

  return parts.length ? parts.join(' | ') : 'Contact not available';
}

async function fetchClinicalTrials(disease, maxResults = 40) {
  try {
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(disease)}&pageSize=${maxResults}&format=json`;
    const response = await axios.get(url, { timeout: 30000 });
    const studies = response.data?.studies || [];

    return studies.map((study) => {
      const protocol = study?.protocolSection || {};
      const identification = protocol.identificationModule || {};
      const statusModule = protocol.statusModule || {};
      const designModule = protocol.designModule || {};
      const eligibilityModule = protocol.eligibilityModule || {};
      const contactsLocationsModule = protocol.contactsLocationsModule || {};

      const phaseList = Array.isArray(designModule.phases) ? designModule.phases : [];
      const locationList = Array.isArray(contactsLocationsModule.locations) ? contactsLocationsModule.locations : [];
      const centralContacts = Array.isArray(contactsLocationsModule.centralContacts) ? contactsLocationsModule.centralContacts : [];
      const overallContacts = Array.isArray(contactsLocationsModule.overallOfficials) ? contactsLocationsModule.overallOfficials : [];
      const chosenContact = centralContacts[0] || overallContacts[0] || null;
      const nctId = identification.nctId || 'N/A';

      const locations = locationList.length
        ? locationList.slice(0, 3).map(formatLocation).filter(Boolean).join(' | ')
        : 'Location not specified';

      return {
        title: identification.briefTitle || identification.officialTitle || 'Untitled study',
        status: statusModule.overallStatus || 'Unknown',
        phase: phaseList.length ? phaseList.join(', ') : 'N/A',
        eligibility: truncate(eligibilityModule.eligibilityCriteria, 400),
        locations: locations || 'Location not specified',
        contact: formatContact(chosenContact),
        nctId,
        url: nctId !== 'N/A' ? `https://clinicaltrials.gov/study/${nctId}` : 'https://clinicaltrials.gov',
        startDate: statusModule.startDateStruct?.date || 'N/A',
        source: 'ClinicalTrials.gov'
      };
    });
  } catch (error) {
    console.error('ClinicalTrials.gov fetch failed:', error.message);
    return [];
  }
}

module.exports = { fetchClinicalTrials };
