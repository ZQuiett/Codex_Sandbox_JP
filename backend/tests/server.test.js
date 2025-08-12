const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const HISTORY_FILE = path.join(__dirname, '..', '..', 'data', 'history.json');

beforeEach(() => {
  if (fs.existsSync(HISTORY_FILE)) fs.unlinkSync(HISTORY_FILE);
});

test('history endpoint returns array', async () => {
  const res = await request(app).get('/api/history/test');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
