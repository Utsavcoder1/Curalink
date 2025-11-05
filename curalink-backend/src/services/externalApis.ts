/*export class ExternalAPIService {
  // Example method to fetch clinical trials from an external API
  static async fetchClinicalTrials(query: string) {
    try {
      const response = await fetch(
        `https://clinicaltrials.gov/api/query/full_studies?expr=${encodeURIComponent(query)}&min_rnk=1&max_rnk=10&fmt=json`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching clinical trials:', error);
      throw new Error('Failed to fetch clinical trials');
    }
  }

  // Enhanced AI summary generation
  static generateAISummary(title: string, abstract: string, type?: string): string {
    if (!abstract || abstract === 'No abstract available') {
      return `This ${type || 'research'} titled "${title}" discusses important findings in medical research. The study provides valuable insights that could benefit patients and researchers alike.`;
    }

    const sentences = abstract.split('. ').slice(0, 3);
    let summary = `This ${type || 'study'} ${sentences.join('. ')}. `;

    if (type === 'clinical_trial') {
      summary += 'This clinical trial investigates potential new treatments that could help patients.';
    } else if (type === 'publication') {
      summary += 'The research provides valuable insights for medical professionals and researchers.';
    } else {
      summary += 'The findings contribute to advancing medical knowledge and patient care.';
    }

    return summary;
  }

  // Enhanced version for clinical trials
  static generateTrialSummary(trial: any): string {
    const conditions = trial.conditions?.join(', ') || 'medical conditions';
    const interventions = trial.interventions?.join(', ') || 'experimental treatments';
    const phase = trial.phases?.[0] || 'clinical';

    return `This ${phase} trial focuses on ${conditions} using ${interventions}. ${
      trial.description || 'The study aims to evaluate safety and effectiveness of new treatment approaches.'
    }`;
  }

  // ... other methods if needed ...
}
*/
import axios from 'axios';
import ClinicalTrial from '../models/ClinicalTrial';
import Publication from '../models/Publication';
import Expert from '../models/Expert';

export class ExternalAPIService {
  // ===============================
  // ClinicalTrials.gov API
  // ===============================
  static async fetchClinicalTrials(condition: string, location?: string): Promise<any[]> {
    try {
      console.log(`🔍 Fetching clinical trials for: ${condition}`);

      const searchExpr = location ? `${condition} AND ${location}` : condition;
      const response = await axios.get(
        'https://clinicaltrials.gov/api/query/study_fields',
        {
          params: {
            expr: searchExpr,
            fields:
              'NCTId,BriefTitle,OfficialTitle,BriefSummary,Condition,InterventionName,Phase,OverallStatus,LocationFacility,LocationCity,LocationCountry,LocationStatus,EligibilityCriteria,Gender,MinimumAge,MaximumAge,HealthyVolunteers,Sponsor,StartDate,CompletionDate',
            fmt: 'json',
            max_rnk: 50,
          },
        }
      );

      const trials = response.data.StudyFieldsResponse?.StudyFields || [];
      const savedTrials = [];

      for (const trial of trials) {
        const existingTrial = await ClinicalTrial.findOne({ nctId: trial.NCTId?.[0] });

        if (!existingTrial) {
          const newTrial = new ClinicalTrial({
            nctId: trial.NCTId?.[0] || '', // ✅ fallback added
            title: trial.OfficialTitle?.[0] || trial.BriefTitle?.[0] || 'Untitled Trial',
            briefTitle: trial.BriefTitle?.[0] || '',
            description: trial.BriefSummary?.[0] || '', // ✅ avoid undefined
            conditions: trial.Condition || [],
            interventions: trial.InterventionName || [],
            phases: trial.Phase || [],
            status: trial.OverallStatus?.[0]?.toLowerCase() || 'unknown',
            eligibility: {
              criteria: trial.EligibilityCriteria?.[0] || '',
              gender: trial.Gender?.[0] || 'All',
              minimumAge: trial.MinimumAge?.[0] || '',
              maximumAge: trial.MaximumAge?.[0] || '',
              healthyVolunteers:
                trial.HealthyVolunteers?.[0] === 'Accepts Healthy Volunteers',
            },
            locations: (trial.LocationCountry || []).map(
              (country: string, index: number) => ({
                name: trial.LocationFacility?.[index] || '',
                city: trial.LocationCity?.[index] || '',
                country: country,
                status: trial.LocationStatus?.[index] || '',
              })
            ),
            sponsors: trial.Sponsor || [],
            contacts: [],
          });

          await newTrial.save();
          savedTrials.push(newTrial);
        } else {
          savedTrials.push(existingTrial);
        }
      }

      console.log(`✅ Fetched ${savedTrials.length} clinical trials`);
      return savedTrials;
    } catch (error) {
      console.error('Error fetching clinical trials:', error);
      return [];
    }
  }

  // ===============================
  // PubMed API for publications
  // ===============================
  static async fetchPublications(query: string): Promise<any[]> {
    try {
      console.log(`🔍 Fetching publications for: ${query}`);

      const searchResponse = await axios.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
        {
          params: {
            db: 'pubmed',
            term: query,
            retmode: 'json',
            retmax: 20,
            sort: 'relevance',
          },
        }
      );

      const ids = searchResponse.data.esearchresult?.idlist || [];

      if (ids.length === 0) {
        return [];
      }

      const fetchResponse = await axios.get(
        'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi',
        {
          params: {
            db: 'pubmed',
            id: ids.join(','),
            retmode: 'json',
          },
        }
      );

      const publicationsData = fetchResponse.data.result;
      const savedPublications = [];

      for (const id of ids) {
        const pubData = publicationsData[id];

        if (pubData) {
          const existingPub = await Publication.findOne({ pmid: id });

          if (!existingPub) {
            const authors = pubData.authors?.map((author: any) => author.name) || [];

            const newPublication = new Publication({
              pmid: id,
              title: pubData.title || 'No title available',
              abstract: pubData.abstract || 'No abstract available',
              authors: authors,
              journal: pubData.source || 'Unknown journal',
              publicationDate: new Date(pubData.pubdate || Date.now()),
              doi: pubData.doi,
              keywords: pubData.keywords || [],
              url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
              source: 'pubmed',
              aiSummary: this.generateAISummary(pubData.title || '', pubData.abstract || '', 'publication'),
            });

            await newPublication.save();
            savedPublications.push(newPublication);

            await this.createExpertProfiles(authors, pubData.source, query);
          } else {
            savedPublications.push(existingPub);
          }
        }
      }

      console.log(`✅ Fetched ${savedPublications.length} publications`);
      return savedPublications;
    } catch (error) {
      console.error('Error fetching publications:', error);
      return [];
    }
  }

  // ===============================
  // Generate AI summary
  // ===============================
  public static generateAISummary(title: string, abstract: string, type?: string): string {
    if (!abstract || abstract === 'No abstract available') {
      return `This ${type || 'research'} titled "${title}" discusses important findings in medical research. The study provides valuable insights that could benefit patients and researchers alike.`;
    }

    const sentences = abstract.split('. ').slice(0, 2);
    let summary = `This ${type || 'study'} ${sentences.join('. ')}. `;

    if (type === 'clinical_trial') {
      summary += 'This clinical trial investigates potential new treatments that could help patients.';
    } else if (type === 'publication') {
      summary += 'The research provides valuable insights for medical professionals and researchers.';
    } else {
      summary += 'The findings contribute to advancing medical knowledge and patient care.';
    }

    return summary;
  }

  // ===============================
  // Create expert profiles from authors
  // ===============================
  private static async createExpertProfiles(authors: string[], institution: string, researchArea: string): Promise<void> {
    try {
      for (const authorName of authors.slice(0, 5)) {
        const existingExpert = await Expert.findOne({ name: authorName });

        if (!existingExpert) {
          const newExpert = new Expert({
            name: authorName,
            institution: institution,
            position: 'Researcher',
            specialties: [researchArea],
            researchInterests: [researchArea],
            location: {
              city: '',
              country: '',
            },
            isOnPlatform: false,
            isAvailableForMeetings: false,
          });

          await newExpert.save();
        }
      }
    } catch (error) {
      console.error('Error creating expert profiles:', error);
    }
  }
}
