// pages/api/auth/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../utils/mongodb';

const register = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    const client = await clientPromise;
    const db = client.db('educational_portal'); // Укажите имя вашей базы данных
    const user = await db.collection('users').findOne({ email });

    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, password: hashedPassword });
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
    res.status(201).json({ token });
};

export default register;
