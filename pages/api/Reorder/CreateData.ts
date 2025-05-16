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
  const DataCollection = db.collection("Reorder");
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
      ProductSKU,
      ProductName,
      CurrentStock,
      ReorderLevel,
      SupplierName,
      LastOrderDate,
      LeadTime,
      ReorderQTY,
      Status,
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      ProductSKU: String(ProductSKU),
      ProductName: String(ProductName),
      CurrentStock: String(CurrentStock),
      ReorderLevel: String(ReorderLevel),
      SupplierName: String(SupplierName),
      LastOrderDate: String(LastOrderDate),
      LeadTime: String(LeadTime),
      ReorderQTY: String(ReorderQTY),
      Status: String(Status),
      createdAt: new Date(),
    };

    await Add(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return res.status(500).json({ success: false, message: "Insert failed", error });
  }
}
