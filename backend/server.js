// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/database');
const medicalRoutes = require('./src/routes/medicalRecordRoutes');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// -------------------- DATABASE CONNECTION --------------------
connectDB(); // calls your database.js connect function

// -------------------- ROUTES --------------------
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/medical', medicalRoutes);

// -------------------- SERVER LISTEN --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
