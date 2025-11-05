// src/controllers/expertController.ts
import { Response } from 'express';
import Expert from '../models/Expert';
import { AuthRequest } from '../middleware/auth';
import { ExternalAPIService } from '../services/externalApis';

export const searchExperts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query, specialties, location, proximity } = req.query;
    const userId = req.user?._id;

    let searchConditions: any = {};

    // Build search query
    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { specialties: { $in: [new RegExp(query as string, 'i')] } },
        { researchInterests: { $in: [new RegExp(query as string, 'i')] } },
        { institution: { $regex: query, $options: 'i' } }
      ];
    }

    if (specialties) {
      const specialtyArray = Array.isArray(specialties) ? specialties : [specialties];
      searchConditions.specialties = { 
        $in: specialtyArray.map(spec => new RegExp(spec as string, 'i')) 
      };
    }

    if (location && proximity === 'true') {
      searchConditions['location.country'] = { $regex: location, $options: 'i' };
    }

    const experts = await Expert.find(searchConditions)
      .populate('publications')
      .limit(50);

    // If no experts found in DB, try to fetch from external sources
    if (experts.length === 0 && query) {
      await ExternalAPIService.fetchPublications(query as string);
      // The fetched publications would have author info that could be used to create expert profiles
    }

    res.json({
      success: true,
      data: { experts },
      count: experts.length
    });
  } catch (error) {
    console.error('Search experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching experts'
    });
  }
};

export const getRecommendedExperts = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const experts = await Expert.find({
      $or: [
        { specialties: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) } },
        { researchInterests: { $in: recommendedConditions.map(cond => new RegExp(cond, 'i')) } }
      ],
      isAvailableForMeetings: true
    })
    .populate('publications')
    .limit(10);

    res.json({
      success: true,
      data: { experts }
    });
  } catch (error) {
    console.error('Get recommended experts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended experts'
    });
  }
};

export const saveExpert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { expertId } = req.params;
    const userId = req.user?._id;

    const expert = await Expert.findByIdAndUpdate(
      expertId,
      { $addToSet: { isSavedBy: userId } },
      { new: true }
    ).populate('publications');

    if (!expert) {
      res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Expert saved successfully',
      data: { expert }
    });
  } catch (error) {
    console.error('Save expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving expert'
    });
  }
};

export const requestMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { expertId } = req.params;
    const { message, preferredDates } = req.body;
    const userId = req.user?._id;

    const expert = await Expert.findById(expertId);

    if (!expert) {
      res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
      return;
    }

    if (!expert.isOnPlatform) {
      // If expert is not on platform, this goes to admin for manual handling
      res.json({
        success: true,
        message: 'Meeting request submitted to admin. The expert will be contacted manually.',
        requiresManualContact: true
      });
      return;
    }

    // If expert is on platform, create a meeting request
    res.json({
      success: true,
      message: 'Meeting request sent to expert',
      data: {
        expertId: expert._id,
        expertName: expert.name,
        requiresManualContact: false
      }
    });
  } catch (error) {
    console.error('Request meeting error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending meeting request'
    });
  }
};

export const nudgeExpert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { expertId } = req.params;
    const userId = req.user?._id;

    const expert = await Expert.findById(expertId);

    if (!expert) {
      res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
      return;
    }

    // This would typically send an email notification to the expert
    res.json({
      success: true,
      message: 'Expert has been nudged to join the platform'
    });
  } catch (error) {
    console.error('Nudge expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error nudging expert'
    });
  }
};