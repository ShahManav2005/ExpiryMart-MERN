const dotenv = require('dotenv');
dotenv.config();                         // must be FIRST

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // import after dotenv.config()
const authRoutes = require('./routers/authRoutes')

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes)

app.get('/', (req, res) => res.send('ExpiryMart API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));