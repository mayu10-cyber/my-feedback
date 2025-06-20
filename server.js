import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataFile = path.join(__dirname, 'feedback.json');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin: ' + origin));
    }
  },
  methods: ['GET', 'POST']
}));

app.use(express.json());

// Load feedback from file
function loadFeedback() {
  try {
    const raw = fs.existsSync(dataFile) ? fs.readFileSync(dataFile) : '[]';
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading feedback:', err);
    return [];
  }
}

// Save feedback to file
function saveFeedback(data) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error writing feedback:', err);
    return false;
  }
}

// GET all feedback
app.get('/api/feedback', (req, res) => {
  const data = loadFeedback();
  res.json(data);
});

// POST new feedback
app.post('/api/feedback', (req, res) => {
  const { name, department, rating, feedback } = req.body;

  if (!name || !department || typeof rating !== 'number' || !feedback) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const allFeedback = loadFeedback();
  allFeedback.push({ name, department, rating, feedback });

  const success = saveFeedback(allFeedback);
  if (success) {
    res.status(201).json({ message: 'Feedback saved' });
  } else {
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
