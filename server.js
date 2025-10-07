
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();


app.use((req, res, next) => {
  console.log('REQ ->', req.method, req.originalUrl);
  next();
});


app.use(express.json());


connectDB();


app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);


app.get('/', (req, res) => {
  res.send(' Book Catalog API is running successfully!');
});


app.use(errorHandler);


console.log('MONGO_URI present:', Boolean(process.env.MONGO_URI));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




