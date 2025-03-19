"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clientService_1 = require("../../services/clientService/clientService");
class clientController {
    async registerClient(req, res) {
        try {
            const clientData = req.body;
            const newClient = await clientController.clientService.registerClient(clientData);
            res.status(201).json(newClient);
        }
        catch (error) {
            console.error('Error creating the client:', error);
            res.status(500).json({ error: 'Error creating the client.' });
        }
    }
    async loginClient(req, res) {
        try {
            const { email, password } = req.body;
            // Validate input
            if (!email || !password) {
                res.status(400).json({ error: 'Email and password are required' });
                return;
            }
            // Call service
            const result = await clientController.clientService.loginClient(email, password);
            // Handle response
            if ('message' in result) {
                res.status(401).json({ error: result.message });
            }
            else {
                res.status(200).json(result);
            }
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
}
clientController.clientService = new clientService_1.clientService();
exports.default = new clientController;
