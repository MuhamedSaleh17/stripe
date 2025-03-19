import { Router } from 'express';
import clientController from '../../controller/clientController/clientController';
const clientRouter = Router();
import { authenticateToken } from '../../middleware/authMiddleware';

// Define routes for client operations
// clientRouter.get('/', clientController.getAllclients);
// clientRouter.get('/:id', clientController.getclientById);
clientRouter.post('/signin', clientController.loginClient);
clientRouter.post('/signup', clientController.registerClient);
// clientRouter.put('/:id', clientController.updateclient);
// clientRouter.delete('/:id', clientController.deleteclient);



export default clientRouter;
