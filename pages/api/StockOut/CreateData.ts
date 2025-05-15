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
  const DataCollection = db.collection("Stockout"); 
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
      DateIssuance,
      IssuedBy,
      Recipient,
      Purpose,
      ProductSKU,
      ProductName,
      ProductQuantity,
      UnitMeasure,
      ReferenceDocumentNumber,
      Remarks,
      Status
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      DateIssuance: String(DateIssuance),
      IssuedBy: String(IssuedBy),
      Recipient: String(Recipient),
      Purpose: String(Purpose),
      ProductSKU: String(ProductSKU),
      ProductName: String(ProductName),
      ProductQuantity: String(ProductQuantity),
      UnitMeasure: String(UnitMeasure),
      ReferenceDocumentNumber: String(ReferenceDocumentNumber),
      Remarks: String(Remarks),
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
