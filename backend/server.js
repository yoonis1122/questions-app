const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Question = require('./models/Question');
const Section = require('./models/Section');
const Result = require('./models/Result');

const app = express();
app.use(cors());
app.use(express.json());

// Root Route for health check
app.get('/', (req, res) => {
  res.send('Questions API is running successfully!');
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz-app';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Section Routes
app.get('/api/sections', async (req, res) => {
  try {
    const sections = await Section.find();
    if (sections.length === 0) {
      const defaults = [
        { name: 'history', label: 'History', description: 'Text-based questions exploring world events and historical figures.' },
        { name: 'sports', label: 'Sports', description: 'Image-based questions testing your knowledge of iconic sports moments.' },
        { name: 'foods', label: 'Foods', description: 'Image-based questions challenging your global culinary knowledge.' }
      ];
      const inserted = await Section.insertMany(defaults);
      return res.json(inserted);
    }
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sections', async (req, res) => {
  try {
    const { label, description } = req.body;
    if (!label || !description) throw new Error('Label and description required');
    const name = label.toLowerCase().replace(/\s+/g, '-');
    const newSection = new Section({ name, label, description });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/sections/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) throw new Error('Section not found');
    
    await Question.deleteMany({ section: section.name });
    await section.deleteOne();
    
    res.json({ message: 'Section and associated questions deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes
app.get('/api/questions', async (req, res) => {
  try {
    const { section } = req.query;
    const filter = section ? { section } : {};
    const questions = await Question.find(filter);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/questions', async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) throw new Error('Question not found');
    
    // Instead of findByIdAndUpdate, we assign and save so Mongoose schema validators (like required combinations) work properly
    Object.assign(question, req.body);
    const updatedQuestion = await question.save();
    
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) throw new Error('Question not found');
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Result Routes
app.get('/api/results', async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/results', async (req, res) => {
  try {
    const { playerName, playerImage, section, score, total } = req.body;
    if (!playerName || !section) throw new Error('Player Name and Section required');
    const newResult = new Result({ playerName, playerImage, section, score, total });
    await newResult.save();
    res.status(201).json(newResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/results/:id', async (req, res) => {
  try {
    const updatedResult = await Result.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedResult) throw new Error('Result not found');
    res.json(updatedResult);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/results/:id', async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) throw new Error('Result not found');
    res.json({ message: 'Result deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
