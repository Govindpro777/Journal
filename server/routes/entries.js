import express from 'express';
import auth from '../middleware/auth.js';
import JournalEntry from '../models/JournalEntry.js';

const router = express.Router();

// Get all entries for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching entries' });
  }
});

// Create a new entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const entry = new JournalEntry({
      userId: req.user.id,
      title,
      content,
      mood,
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry' });
  }
});

// Update an entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, mood } = req.body;
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    entry.title = title;
    entry.content = content;
    entry.mood = mood;
    await entry.save();

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry' });
  }
});

// Delete an entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry' });
  }
});

export default router;
