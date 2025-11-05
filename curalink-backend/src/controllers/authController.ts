// src/controllers/authController.ts
import { Request, Response } from 'express';
import User, { IUser, PatientProfile, ResearcherProfile } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role, profile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
      return;
    }

    // Create user based on role
    let userProfile: PatientProfile | ResearcherProfile;

    if (role === 'patient') {
      userProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dateOfBirth: profile.dateOfBirth,
        location: profile.location,
        conditions: profile.conditions || [],
        interests: profile.interests || [],
        avatar: profile.avatar
      };
    } else {
      userProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        specialties: profile.specialties || [],
        researchInterests: profile.researchInterests || [],
        institution: profile.institution,
        position: profile.position,
        orcid: profile.orcid,
        researchGate: profile.researchGate,
        publications: profile.publications || [],
        isAvailableForMeetings: profile.isAvailableForMeetings || false,
        avatar: profile.avatar
      };
    }

    const user = new User({
      email,
      password,
      role,
      profile: userProfile
    });

    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration process'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in login process'
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
};