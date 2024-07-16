// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '../../../utils/mongodb';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    const client = await clientPromise;
    const db = client.db('educational_portal'); // Укажите имя вашей базы данных
    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
    res.status(200).json({ token });
};

export default login;
