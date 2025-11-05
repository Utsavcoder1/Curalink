// src/controllers/dashboardController.ts
import { Response } from 'express';
import ClinicalTrial from '../models/ClinicalTrial';
import Publication from '../models/Publication';
import Expert from '../models/Expert';
import { AuthRequest } from '../middleware/auth';
import { ExternalAPIService } from '../services/externalApis';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    let recommendedConditions: string[] = [];

    if (user.role === 'patient') {
      const patientProfile = user.profile as any;
      recommendedConditions = patientProfile.conditions || [];
    } else {
      const researcherProfile = user.profile as any;
      recommendedConditions = researcherProfile.researchInterests || [];
    }

    // If user has conditions/interests, fetch personalized content
    if (recommendedConditions.length > 0) {
      const primaryCondition = recommendedConditions[0];
      
      // Only fetch external data if primaryCondition is defined
      if (primaryCondition) {
        // Fetch external data in background
        Promise.all([
          ExternalAPIService.fetchClinicalTrials(primaryCondition),
          ExternalAPIService.fetchPublications(primaryCondition)
        ]).catch(error => {
          console.error('Background data fetch error:', error);
        });
      }
    }

    // Get recommended content from database
    const [trials, publications, experts] = await Promise.all([
      // Clinical Trials
      ClinicalTrial.find({
        conditions: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) },
        status: 'recruiting'
      }).limit(5),

      // Publications
      Publication.find({
        $or: [
          { title: { $in: recommendedConditions.map(keyword => new RegExp(keyword, 'i')) } },
          { abstract: { $in: recommendedConditions.map(keyword => new RegExp(keyword, 'i')) } },
          { keywords: { $in: recommendedConditions.map(keyword => new RegExp(keyword, 'i')) } }
        ]
      })
      .sort({ publicationDate: -1 })
      .limit(5),

      // Experts/Collaborators
      Expert.find({
        $or: [
          { specialties: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) } },
          { researchInterests: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) } }
        ]
      })
      .populate('publications')
      .limit(5)
    ]);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        },
        recommended: {
          clinicalTrials: trials,
          publications,
          experts: user.role === 'patient' ? experts : undefined,
          collaborators: user.role === 'researcher' ? experts : undefined
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    // Check if userId is defined
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const [savedTrials, savedPublications, savedExperts] = await Promise.all([
      ClinicalTrial.find({ isSavedBy: userId }),
      Publication.find({ isSavedBy: userId }),
      Expert.find({ isSavedBy: userId }).populate('publications')
    ]);

    res.json({
      success: true,
      message: 'Favorites retrieved successfully',
      data: {
        clinicalTrials: savedTrials,
        publications: savedPublications,
        experts: savedExperts
      }
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites'
    });
  }
};