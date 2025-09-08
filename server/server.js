const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// Passport config
require('./middleware/passport');
const authRoutes = require('./routes/authRoutes');
const guestRoutes = require('./routes/guestRoutes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(require('passport').initialize());
app.use('/api/guests', guestRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
