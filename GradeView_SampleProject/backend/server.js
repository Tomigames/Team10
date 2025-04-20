// server.js
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const transcriptsRoutes  = require('./routes/transcripts');
const gradeWeightsRoutes = require('./routes/gradeWeights');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// transcript (credits) endpoints
app.use('/api', transcriptsRoutes);

// grade‑weights endpoints
app.use('/api', gradeWeightsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
