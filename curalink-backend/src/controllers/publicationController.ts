// src/controllers/publicationController.ts
import { Response } from 'express';
import Publication from '../models/Publication';
import { AuthRequest } from '../middleware/auth';
import { ExternalAPIService } from '../services/externalApis';

export const searchPublications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, journals, yearFrom, yearTo } = req.query;
    
    let searchConditions: any = {};

    if (query) {
      searchConditions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { abstract: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query as string, 'i')] } },
        { authors: { $in: [new RegExp(query as string, 'i')] } }
      ];
    }

    if (journals) {
      const journalArray = Array.isArray(journals) ? journals : [journals];
      searchConditions.journal = { 
        $in: journalArray.map(journal => new RegExp(journal as string, 'i')) 
      };
    }

    if (yearFrom || yearTo) {
      searchConditions.publicationDate = {};
      if (yearFrom) {
        searchConditions.publicationDate.$gte = new Date(`${yearFrom}-01-01`);
      }
      if (yearTo) {
        searchConditions.publicationDate.$lte = new Date(`${yearTo}-12-31`);
      }
    }

    const publications = await Publication.find(searchConditions).limit(50);

    // If no publications found, try external API
    if (publications.length === 0 && query) {
      const fetchedPublications = await ExternalAPIService.fetchPublications(query as string);
      res.json({
        success: true,
        data: { publications: fetchedPublications },
        count: fetchedPublications.length,
        fromExternal: true
      });
      return;
    }

    res.json({
      success: true,
      data: { publications },
      count: publications.length
    });
  } catch (error) {
    console.error('Search publications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching publications'
    });
  }
};

export const getRecommendedPublications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    let recommendedKeywords: string[] = [];

    if (user.role === 'patient') {
      const patientProfile = user.profile as any;
      recommendedKeywords = patientProfile.conditions || [];
    } else {
      const researcherProfile = user.profile as any;
      recommendedKeywords = researcherProfile.researchInterests || [];
    }

    const publications = await Publication.find({
      $or: [
        { title: { $in: recommendedKeywords.map(keyword => new RegExp(keyword, 'i')) } },
        { abstract: { $in: recommendedKeywords.map(keyword => new RegExp(keyword, 'i')) } },
        { keywords: { $in: recommendedKeywords.map(keyword => new RegExp(keyword, 'i')) } }
      ]
    })
    .sort({ publicationDate: -1 })
    .limit(10);

    res.json({
      success: true,
      data: { publications }
    });
  } catch (error) {
    console.error('Get recommended publications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended publications'
    });
  }
};

export const savePublication = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { publicationId } = req.params;
    const userId = req.user?._id;

    const publication = await Publication.findByIdAndUpdate(
      publicationId,
      { $addToSet: { isSavedBy: userId } },
      { new: true }
    );

    if (!publication) {
      res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Publication saved successfully',
      data: { publication }
    });
  } catch (error) {
    console.error('Save publication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving publication'
    });
  }
};

export const getSavedPublications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const publications = await Publication.find({ isSavedBy: userId });

    res.json({
      success: true,
      data: { publications },
      count: publications.length
    });
  } catch (error) {
    console.error('Get saved publications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved publications'
    });
  }
};