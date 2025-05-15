import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, ReceivedStatus } = req.body;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid ID is required' });
    }

    if (!ReceivedStatus) {
        return res.status(400).json({ error: 'ReceivedStatus is required' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('ReceivedItems');

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { ReceivedStatus, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated to Posted.' });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ error: 'Server error' });
    }
}
