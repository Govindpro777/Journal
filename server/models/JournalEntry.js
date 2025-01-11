import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad'],
    default: 'Neutral',
  },
}, {
  timestamps: true,
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;