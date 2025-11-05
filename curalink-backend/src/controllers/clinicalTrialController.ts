// src/controllers/clinicalTrialController.ts
import { Response } from 'express';
import ClinicalTrial from '../models/ClinicalTrial';
import { AuthRequest } from '../middleware/auth';
import { ExternalAPIService } from '../services/externalApis';

export const searchClinicalTrials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, conditions, status, location, phase } = req.query;
    
    let searchConditions: any = {};

    // Build search conditions based on query parameters
    if (query) {
      searchConditions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { conditions: { $in: [new RegExp(query as string, 'i')] } },
        { interventions: { $in: [new RegExp(query as string, 'i')] } }
      ];
    }

    if (conditions) {
      const conditionArray = Array.isArray(conditions) ? conditions : [conditions];
      searchConditions.conditions = { $in: conditionArray.map(cond => new RegExp(cond as string, 'i')) };
    }

    if (status) {
      searchConditions.status = status;
    }

    if (location) {
      searchConditions['locations.country'] = { $regex: location, $options: 'i' };
    }

    if (phase) {
      searchConditions.phases = phase;
    }

    const trials = await ClinicalTrial.find(searchConditions).limit(50);

    // If no trials found, try external API
    if (trials.length === 0 && query) {
      const externalTrials = await ExternalAPIService.fetchClinicalTrials(query as string);
      res.json({
        success: true,
        data: { trials: externalTrials },
        count: externalTrials.length,
        fromExternal: true
      });
      return;
    }

    res.json({
      success: true,
      data: { trials },
      count: trials.length
    });
  } catch (error) {
    console.error('Search trials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching clinical trials'
    });
  }
};

export const getRecommendedTrials = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const trials = await ClinicalTrial.find({
      conditions: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) },
      status: 'recruiting'
    }).limit(10);

    res.json({
      success: true,
      data: { trials }
    });
  } catch (error) {
    console.error('Get recommended trials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended trials'
    });
  }
};

export const saveTrial = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trialId } = req.params;
    const userId = req.user?._id;

    const trial = await ClinicalTrial.findByIdAndUpdate(
      trialId,
      { $addToSet: { isSavedBy: userId } },
      { new: true }
    );

    if (!trial) {
      res.status(404).json({
        success: false,
        message: 'Clinical trial not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Trial saved successfully',
      data: { trial }
    });
  } catch (error) {
    console.error('Save trial error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving trial'
    });
  }
};

export const getSavedTrials = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const trials = await ClinicalTrial.find({ isSavedBy: userId });

    res.json({
      success: true,
      data: { trials },
      count: trials.length
    });
  } catch (error) {
    console.error('Get saved trials error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved trials'
    });
  }
};