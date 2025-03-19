import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (clientId: string): string => {
    return jwt.sign({ clientId  }, JWT_SECRET, { expiresIn: '7d' });
};
