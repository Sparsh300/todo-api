const express = require('express');
const app = express();

app.use(express.json());

let tasks = [];

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

const server = app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = server;
