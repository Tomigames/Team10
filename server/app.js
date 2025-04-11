// Kunju Menon - sxm22026
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');


const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);

// errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});