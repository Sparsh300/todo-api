const request = require('supertest');
const server = require('../app');  // adjust if your file structure is different

describe('Task API', () => {
  it('GET /tasks should return empty list', async () => {
    const res = await request(server).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });
});

// Properly close the server after tests to prevent Jest from hanging
afterAll((done) => {
  server.close(done);
});
