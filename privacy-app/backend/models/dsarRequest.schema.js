import mongoose from "mongoose";

const dsarRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestType: { type: String, required: true },
    description: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  });

export const DSARRequest = mongoose.model('DSARRequest', dsarRequestSchema);