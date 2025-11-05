export interface User {
  _id: string;
  email: string;
  role: 'patient' | 'researcher' | 'admin';
  profile: PatientProfile | ResearcherProfile;
  lastLogin?: string;
}

export interface PatientProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  location: {
    city: string;
    country: string;
  };
  conditions: string[];
  interests: string[];
  avatar?: string;
}

export interface ResearcherProfile {
  firstName: string;
  lastName: string;
  specialties: string[];
  researchInterests: string[];
  institution: string;
  position: string;
  orcid?: string;
  researchGate?: string;
  publications: string[];
  isAvailableForMeetings: boolean;
  avatar?: string;
}

export interface ClinicalTrial {
  _id: string;
  nctId: string;
  title: string;
  briefTitle?: string;
  description?: string;
  conditions: string[];
  interventions: string[];
  phases: string[];
  status: string;
  eligibility: {
    criteria: string;
    gender: string;
    minimumAge: string;
    maximumAge: string;
    healthyVolunteers: boolean;
  };
  locations: {
    name: string;
    city: string;
    country: string;
    status: string;
  }[];
  sponsors: string[];
  contacts: {
    name: string;
    email: string;
    phone?: string;
  }[];
  startDate?: string;
  completionDate?: string;
  aiSummary?: string;
  isSavedBy: string[];
}

export interface Publication {
  _id: string;
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: string;
  doi?: string;
  keywords: string[];
  url: string;
  aiSummary?: string;
  isSavedBy: string[];
}

export interface Expert {
  _id: string;
  name: string;
  email?: string;
  institution: string;
  position: string;
  specialties: string[];
  researchInterests: string[];
  location: {
    city: string;
    country: string;
  };
  publications: string[];
  isOnPlatform: boolean;
  isAvailableForMeetings: boolean;
  isSavedBy: string[];
}

export interface Forum {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  isActive: boolean;
}

export interface ForumPost {
  _id: string;
  forum: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'patient' | 'researcher';
  isQuestion: boolean;
  tags: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ForumReply {
  _id: string;
  content: string;
  author: string;
  authorRole: 'researcher';
  post: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}