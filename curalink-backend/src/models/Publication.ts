// src/models/Publication.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPublication extends Document {
  pmid: string;
  title: string;
  abstract: string;
  authors: string[];
  journal: string;
  publicationDate: Date;
  doi?: string;
  keywords: string[];
  url: string;
  aiSummary?: string;
  isSavedBy: mongoose.Types.ObjectId[];
  source: 'pubmed' | 'researchgate' | 'orcid' | 'manual';
}

const publicationSchema = new Schema<IPublication>({
  pmid: {
    type: String,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: true
  },
  abstract: String,
  authors: [String],
  journal: String,
  publicationDate: Date,
  doi: String,
  keywords: [String],
  url: String,
  aiSummary: String,
  isSavedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  source: {
    type: String,
    enum: ['pubmed', 'researchgate', 'orcid', 'manual'],
    default: 'manual'
  }
}, {
  timestamps: true
});

export default mongoose.model<IPublication>('Publication', publicationSchema);