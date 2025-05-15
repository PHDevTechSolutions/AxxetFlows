import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Enable JSON body parsing
export const config = {
  api: {
    bodyParser: true,
  },
};

async function Add(data: any) {
  const db = await connectToDatabase();
  const DataCollection = db.collection("Products"); 
  await DataCollection.insertOne(data);
  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const {
      ReferenceNumber,
      ProductName,
      ProductSKU,
      ProductDescription,
      ProductQuantity,
      ProductCostPrice,
      ProductSellingPrice,
      ProductStatus
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      ProductName: String(ProductName),
      ProductSKU: String(ProductSKU),
      ProductDescription: String(ProductDescription),
      ProductQuantity: String(ProductQuantity),
      ProductCostPrice: String(ProductCostPrice),
      ProductSellingPrice: String(ProductSellingPrice),
      ProductStatus: String(ProductStatus),
      createdAt: new Date(),
    };

    await Add(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return res.status(500).json({ success: false, message: "Insert failed", error });
  }
}
