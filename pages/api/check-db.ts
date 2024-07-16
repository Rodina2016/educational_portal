// pages/api/check-db.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/mongodb';

const checkDb = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db('educational_portal'); // Имя вашей базы данных
        const users = await db.collection('users').find({}).toArray();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error,
        });
    }
};

export default checkDb;
