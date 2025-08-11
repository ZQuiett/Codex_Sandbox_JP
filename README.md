# Landscaping Task Assistant

This MVP demonstrates a web-based application for landscaping crews to upload property photos, receive AI-powered maintenance recommendations, and track past actions.

## Features
- Upload a property photo.
- Python script analyzes the image (simple color-based heuristic).
- Task recommendations such as mowing or spraying.
- Weather data integration (uses OpenWeather API if `OPENWEATHER_API_KEY` is set).
- History log stored in `data/history.json`.
- Minimal React front-end using CDN scripts.

## Getting Started
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   pip install -r requirements.txt
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open `frontend/index.html` in a browser.

## Tests
Run backend tests:
```bash
cd backend
npm test
```
