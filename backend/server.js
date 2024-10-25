const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');  
const cors = require('cors');  
const ruleRoutes = require('./routes/rules');
const db = require('./db');  

const app = express();
const port = 3001;

// Middleware
app.use(cors());  
app.use(bodyParser.json());
app.use(morgan('dev'));  

// Use routes
app.use('/api/rules', ruleRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err.message);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
