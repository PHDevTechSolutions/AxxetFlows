import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../lib/mongodb';

export default async function Fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const DataCollection = db.collection('Reorder');
    const data = await DataCollection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
