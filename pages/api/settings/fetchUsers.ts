import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../lib/mongodb';

export default async function fetchAccounts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    const accounts = await usersCollection.find({}).toArray();
    res.status(200).json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
