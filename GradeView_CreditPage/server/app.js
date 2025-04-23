// app.js
const express = require('express');
const cors = require('cors');
const transcriptRoutes = require('./routes/transcripts');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// only credits route
app.use(transcriptRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
