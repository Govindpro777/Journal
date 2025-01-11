import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Hardcoded quotes as a fallback if the API is not available
const quotes = [
  { quote: "The only way to do great work is to love what you do." },
  { quote: "Believe you can and you're halfway there." },
  { quote: "Every day is a new beginning." },
  { quote: "Your attitude determines your direction." },
  { quote: "The future belongs to those who believe in the beauty of their dreams." },
];

router.get('/', auth, async (req, res) => {
  try {
    // Try to fetch from zenquotes API first
    const response = await fetch('https://zenquotes.io/api/random');
    const data = await response.json();
    
    if (data && data[0]?.q) {
      res.json({ quote: data[0].q });
    } else {
      // Fallback to hardcoded quotes
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      res.json(randomQuote);
    }
  } catch (error) {
    // If API fails, use hardcoded quotes
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  }
});

export default router;