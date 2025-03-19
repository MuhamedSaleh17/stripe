import  { IClient } from '../../model/client/client.model';
import bcrypt from 'bcryptjs';

import ClientModel from "../../model/client/client.model"
import { generateToken } from '../../utills/jwt';
export class clientService {

    async registerClient(clientData: Partial<IClient>): Promise<{ token?: string, message: string }> {
        try {
        console.log('Received client data:', clientData);
        const existingClient = await ClientModel.findOne({ email: clientData.email });
        if (existingClient) {
          return { message: 'This email already exists, try another one' };
        }

      
      const salt = await bcrypt.genSalt(10);
      if (!clientData?.password) {
        throw new Error('Password is required');
      }
      const hashedPassword = await bcrypt.hash(clientData.password, salt);

      const client = await ClientModel.create({
        ...clientData,
        password: hashedPassword,
      });

      const token = generateToken(client._id.toString());

      return { token, message: 'Registered successfully' };   
    } catch (error) {
            console.error('Error saving the client:', error);
            throw error;
        }
    }

    async loginClient(email: string, password: string): Promise<{ token: string; user: Omit<IClient, 'password'> } | { message: string }> {
        try {
          const client = await ClientModel.findOne({ email:email }).select('+password');
            if (!client) {
                return { message: 'Invalid credentials' };
            } 
            
            const isPasswordValid = await bcrypt.compare(password, client.password);
           
          if (!isPasswordValid) {
            return { message: 'Invalid credentials' };
          }
    
          const token = generateToken(client._id.toString());
        
          const userResponse = {
            _id: client._id,
            email: client.email,
            name: client.name,
            phone: client.phone,
            steps: client.steps,
            companies: client.companies,
            connection: client.connection,
            paid: client.paid,
            createdAt: client.createdAt,
          };
    
          return {
             token,
             user: userResponse };
    
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login failed');
        }
      }

}
