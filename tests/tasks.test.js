const request = require('supertest');
const app = require('../app');  // now you're importing the app, not server

describe('Task API', () => {
  it('GET /tasks should return empty list', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});
