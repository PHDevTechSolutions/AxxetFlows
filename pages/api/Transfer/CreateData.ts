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
  const DataCollection = db.collection("Transfer"); 
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
      DateTransfer,
      RequestedBy,
      FromLocation,
      ToLocation,
      ProductSKU,
      ProductName,
      ProductQuantity,
      UnitMeasure,
      ReasonTransfer,
      Status,
      Remarks,
      Approver
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      DateTransfer: String(DateTransfer),
      RequestedBy: String(RequestedBy),
      FromLocation: String(FromLocation),
      ToLocation: String(ToLocation),
      ProductSKU: String(ProductSKU),
      ProductName: String(ProductName),
      ProductQuantity: String(ProductQuantity),
      UnitMeasure: String(UnitMeasure),
      ReasonTransfer: String(ReasonTransfer),
      Status: String(Status),
      Remarks: String(Remarks),
      Approver: String(Approver),
      createdAt: new Date(),
    };

    await Add(record);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Insert error", error);
    return res.status(500).json({ success: false, message: "Insert failed", error });
  }
}
