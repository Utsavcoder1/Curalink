// src/models/ClinicalTrial.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClinicalTrial extends Document {
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
  startDate?: Date;
  completionDate?: Date;
  aiSummary?: string;
  isSavedBy: mongoose.Types.ObjectId[];
}

const clinicalTrialSchema = new Schema<IClinicalTrial>({
  nctId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  briefTitle: String,
  description: String,
  conditions: [String],
  interventions: [String],
  phases: [String],
  status: {
    type: String,
    enum: ['recruiting', 'completed', 'active', 'not yet recruiting', 'suspended', 'terminated', 'withdrawn']
  },
  eligibility: {
    criteria: String,
    gender: String,
    minimumAge: String,
    maximumAge: String,
    healthyVolunteers: Boolean
  },
  locations: [{
    name: String,
    city: String,
    country: String,
    status: String
  }],
  sponsors: [String],
  contacts: [{
    name: String,
    email: String,
    phone: String
  }],
  startDate: Date,
  completionDate: Date,
  aiSummary: String,
  isSavedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

export default mongoose.model<IClinicalTrial>('ClinicalTrial', clinicalTrialSchema);