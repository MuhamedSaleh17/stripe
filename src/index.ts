
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;
import stripeRouter from './routes/paymentRoute/payment';
import clientRoute from './routes/clientRoute/clientRoute';

const app = express();

// Middleware cnvcn
app.use(express.json());

// Routes
app.use('/stripe', stripeRouter);
app.use('/client', clientRoute);
mongoose.connect(process.env.DB_CONNECTION as string)
    .then(() => {
        console.log('Connected to MongoDB successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.get('/', (req, res) => {
    res.send('Hello World from Express and Mongoose!');
});

