import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
import stripeRouter from './routes/paymentRoute/payment';
import clientRoute from './routes/clientRoute/clientRoute';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/stripe', stripeRouter);
app.use('/client', clientRoute);

app.get('/', (req, res) => {
    res.send('Hello World from Express and Mongoose!');
});

// Start the server before MongoDB connection to prevent Render timeout
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB separately
mongoose.connect(process.env.DB_CONNECTION as string)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });
