const dsarRequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestType: { type: String, required: true },
    description: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  });

export default mongoose.model('DSARRequest', dsarRequestSchema);