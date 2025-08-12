const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'uploads/') });
const PORT = process.env.PORT || 3001;
const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

app.use(express.json());

function readHistory() {
  if (!fs.existsSync(HISTORY_FILE)) return {};
  return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
}

function writeHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2));
}

// Analyze uploaded image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const propertyId = req.body.propertyId || 'default';
    const imgPath = req.file.path;

    // Call Python analysis script
    const py = spawnSync('python3', [path.join(__dirname, 'ai', 'analyze.py'), imgPath]);
    const result = py.stdout.toString();
    let analysis = {};
    try {
      analysis = JSON.parse(result);
    } catch (e) {
      console.error('Failed to parse analysis', e);
    }

    // Fetch weather (using London as placeholder)
    let weather = {};
    if (OPENWEATHER_API_KEY) {
      try {
        const weatherResp = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${OPENWEATHER_API_KEY}&units=metric`);
        weather = weatherResp.data;
      } catch (e) {
        console.error('Weather fetch failed', e.message);
      }
    }

    // Recommend tasks based on analysis
    const tasks = [];
    if (analysis.grass_overgrown) tasks.push('Mow today');
    if (analysis.weeds_present) tasks.push('Spray in 2 days');
    if (analysis.bush_needs_pruning) tasks.push('Prune next week');
    if (tasks.length === 0) tasks.push('No immediate action');

    // Save history
    const history = readHistory();
    if (!history[propertyId]) history[propertyId] = [];
    history[propertyId].push({
      date: new Date().toISOString(),
      tasks,
    });
    writeHistory(history);

    res.json({ analysis, weather, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// History endpoint
app.get('/api/history/:propertyId', (req, res) => {
  const history = readHistory();
  res.json(history[req.params.propertyId] || []);
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
