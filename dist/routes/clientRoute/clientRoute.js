"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientController_1 = __importDefault(require("../../controller/clientController/clientController"));
const clientRouter = (0, express_1.Router)();
// Define routes for client operations
// clientRouter.get('/', clientController.getAllclients);
// clientRouter.get('/:id', clientController.getclientById);
clientRouter.post('/signin', clientController_1.default.loginClient);
clientRouter.post('/signup', clientController_1.default.registerClient);
// clientRouter.put('/:id', clientController.updateclient);
// clientRouter.delete('/:id', clientController.deleteclient);
exports.default = clientRouter;
