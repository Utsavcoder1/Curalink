// src/models/Expert.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IExpert extends Document {
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
  externalProfiles: {
    orcid?: string;
    researchGate?: string;
    googleScholar?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  isAvailableForMeetings: boolean;
  isSavedBy: mongoose.Types.ObjectId[];
}

const expertSchema = new Schema<IExpert>({
  name: {
    type: String,
    required: true
  },
  email: String,
  institution: {
    type: String,
    required: true
  },
  position: String,
  specialties: [String],
  researchInterests: [String],
  location: {
    city: String,
    country: String
  },
  publications: [{
    type: Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  isOnPlatform: {
    type: Boolean,
    default: false
  },
  externalProfiles: {
    orcid: String,
    researchGate: String,
    googleScholar: String
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  isAvailableForMeetings: {
    type: Boolean,
    default: false
  },
  isSavedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IExpert>('Expert', expertSchema);