"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_model_1 = __importDefault(require("../../model/client/client.model"));
const jwt_1 = require("../../utills/jwt");
class clientService {
    async registerClient(clientData) {
        try {
            const existingClient = await client_model_1.default.findOne({ email: clientData.email });
            if (existingClient) {
                return { message: 'This email already exists, try another one' };
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            if (!clientData?.password) {
                throw new Error('Password is required');
            }
            const hashedPassword = await bcryptjs_1.default.hash(clientData.password, salt);
            const client = await client_model_1.default.create({
                ...clientData,
                password: hashedPassword,
            });
            const token = (0, jwt_1.generateToken)(client._id.toString());
            return { token, message: 'Registered successfully' };
        }
        catch (error) {
            console.error('Error saving the client:', error);
            throw error;
        }
    }
    async loginClient(email, password) {
        try {
            const client = await client_model_1.default.findOne({ email: email }).select('+password');
            if (!client) {
                return { message: 'Invalid credentials' };
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, client.password);
            if (!isPasswordValid) {
                return { message: 'Invalid credentials' };
            }
            const token = (0, jwt_1.generateToken)(client._id.toString());
            const userResponse = {
                _id: client._id,
                email: client.email,
                name: client.name,
                phone: client.phone,
                steps: client.steps,
                company: client.company,
                subsidiaries: client.subsidiaries,
                connection: client.connection,
                paid: client.paid,
                createdAt: client.createdAt,
            };
            return {
                token,
                user: userResponse
            };
        }
        catch (error) {
            console.error('Login error:', error);
            throw new Error('Login failed');
        }
    }
}
exports.clientService = clientService;
