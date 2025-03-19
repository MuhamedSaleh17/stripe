"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const payment_1 = __importDefault(require("./routes/payment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use('/payment', payment_1.default);
mongoose_1.default.connect(process.env.DB_CONNECTION)
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
