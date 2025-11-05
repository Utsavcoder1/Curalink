// src/models/User.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

// src/models/User.ts

export interface IUser extends Document {
  _id: Types.ObjectId; // Add this line
  email: string;
  password: string;
  role: 'patient' | 'researcher' | 'admin';
  profile: PatientProfile | ResearcherProfile;
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}



export interface PatientProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
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

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['patient', 'researcher', 'admin'],
    required: true
  },
  profile: {
    type: Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
// Compare password method
userSchema.methods['comparePassword'] = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this['password']);
};

export default mongoose.model<IUser>('User', userSchema);