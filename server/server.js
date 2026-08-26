const dotenv = require('dotenv');
dotenv.config();                         // must be FIRST
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // import after dotenv.config()
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const inspectionRoutes = require('./routes/inspectionRoutes')
const orderRoutes = require('./routes/orderRoutes')

connectDB();

const app = express();
app.use(cors({
    origin : ['http://localhost:5173' , 'https://expiry-mart-mern.vercel.app'],
    credentials : true,
}));
app.use(express.json());
app.use('/api/auth',authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/inspections' , inspectionRoutes)
app.use('/api/orders',orderRoutes);

app.get('/', (req, res) => res.send('ExpiryMart API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));