import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function fetchCompanies(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const accountsCollection = db.collection('Supplier');

            const { SupplierName } = req.query;

            if (SupplierName) {
                const decodedName = decodeURIComponent(SupplierName as string);

                // Case-insensitive exact match
                const companyDetails = await accountsCollection.findOne({
                    SupplierName: { $regex: new RegExp(`^${decodedName}$`, 'i') },
                });

                if (companyDetails) {
                    return res.status(200).json(companyDetails);
                } else {
                    return res.status(404).json({ error: 'Company not found' });
                }
            } else {
                // Fetch all suppliers (only SupplierName field)
                const companies = await accountsCollection
                    .find({}, { projection: { SupplierName: 1, _id: 0 } })
                    .toArray();

                return res.status(200).json(companies);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            return res.status(500).json({ error: 'Failed to fetch companies' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
