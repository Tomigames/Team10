// server.js
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const authRoutes        = require('./routes/auth');
const coursesRoutes     = require('./routes/courses');
const gradeWeightsRoutes = require('./routes/gradeWeights');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Auth first
app.use('/api', authRoutes);

// Protected endpoints
app.use('/api', coursesRoutes);
app.use('/api', gradeWeightsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend on port ${PORT}`));
