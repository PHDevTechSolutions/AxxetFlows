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
  const DataCollection = db.collection("PurchaseOrder"); 
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
      PONumber,
      PODate,
      BuyerName,
      SupplierName,
      ItemName,
      Quantity,
      UnitPrice,
      PaymentTerms,
      DeliveryAddress,
      DeliveryDate,
      DeliveryStatus,
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      PONumber: String(PONumber),
      PODate: String(PODate),
      BuyerName: String(BuyerName),
      SupplierName: String(SupplierName),
      ItemName: String(ItemName),
      Quantity: String(Quantity),
      UnitPrice: String(UnitPrice),
      PaymentTerms: String(PaymentTerms),
      DeliveryAddress: String(DeliveryAddress),
      DeliveryDate: String(DeliveryDate),
      DeliveryStatus: String(DeliveryStatus),
      createdAt: new Date(),
    };

    await Add(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return res.status(500).json({ success: false, message: "Insert failed", error });
  }
}
