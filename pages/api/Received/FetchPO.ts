import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function fetchPurchaseOrder(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const Collection = db.collection('PurchaseOrder');

            const { PONumber } = req.query;

            if (PONumber) {
                const decodedName = decodeURIComponent(PONumber as string);

                // Case-insensitive exact match
                const Details = await Collection.findOne({
                    PONumber: { $regex: new RegExp(`^${decodedName}$`, 'i') },
                });

                if (Details) {
                    return res.status(200).json(Details);
                } else {
                    return res.status(404).json({ error: 'data not found' });
                }
            } else {
                // Fetch all PONumber (only PONumber field)
                const companies = await Collection
                    .find({}, { projection: { PONumber: 1, _id: 0 } })
                    .toArray();

                return res.status(200).json(companies);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
