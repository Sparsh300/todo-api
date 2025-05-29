const express = require('express');
const app = express();

app.use(express.json());

// Your routes here
app.get('/tasks', (req, res) => {
  res.json([]);
});

// Only listen if not required by another file (i.e. during test)
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}

module.exports = app; // export the app instead of the server
