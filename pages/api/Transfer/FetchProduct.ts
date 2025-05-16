import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function fetchProducts(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const Collection = db.collection('Products');

            const { ProductName } = req.query;

            if (ProductName) {
                const decodedName = decodeURIComponent(ProductName as string);

                // Case-insensitive exact match
                const Details = await Collection.findOne({
                    ProductName: { $regex: new RegExp(`^${decodedName}$`, 'i') },
                });

                if (Details) {
                    return res.status(200).json(Details);
                } else {
                    return res.status(404).json({ error: 'data not found' });
                }
            } else {
                // Fetch all ProductName (only ProductName field)
                const companies = await Collection
                    .find({}, { projection: { ProductName: 1, _id: 0 } })
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
