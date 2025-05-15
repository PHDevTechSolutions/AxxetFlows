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
  const DataCollection = db.collection("ReceivedItems"); 
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
      DateReceived,
      PONumber,
      ReceivedBy,
      SupplierName,
      WarehouseLocation,
      ProductSKU,
      ProductName,
      ProductDescription,
      ProductQuantity,
      ProductBoxes,
      ProductMeasure,
      BatchNumber,
      ExpirationDate,
      Remarks,
      ReceivedStatus,
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      DateReceived: String(DateReceived),
      PONumber: String(PONumber),
      ReceivedBy: String(ReceivedBy),
      SupplierName: String(SupplierName),
      WarehouseLocation: String(WarehouseLocation),
      ProductSKU: String(ProductSKU),
      ProductName: String(ProductName),
      ProductDescription: String(ProductDescription),
      ProductQuantity: String(ProductQuantity),
      ProductBoxes: String(ProductBoxes),
      ProductMeasure: String(ProductMeasure),
      BatchNumber: String(BatchNumber),
      ExpirationDate: String(ExpirationDate),
      Remarks: String(Remarks),
      ReceivedStatus: String(ReceivedStatus),
      createdAt: new Date(),
    };

    await Add(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return res.status(500).json({ success: false, message: "Insert failed", error });
  }
}
