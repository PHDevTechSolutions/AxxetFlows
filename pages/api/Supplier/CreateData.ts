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
  const DataCollection = db.collection("Supplier"); 
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
      SupplierName,
      ContactPerson,
      EmailAddress,
      PhoneNumber,
      Address,
      Categories,
      ProductOffered,
      BusinessNumber,
      PaymentTerms,
      BankDetails,
      Remarks,
      Status,
    } = req.body;

    const record = {
      ReferenceNumber: String(ReferenceNumber),
      SupplierName: String(SupplierName),
      ContactPerson: String(ContactPerson),
      EmailAddress: String(EmailAddress),
      PhoneNumber: String(PhoneNumber),
      Address: String(Address),
      Categories: String(Categories),
      ProductOffered: String(ProductOffered),
      BusinessNumber: String(BusinessNumber),
      PaymentTerms: String(PaymentTerms),
      BankDetails: String(BankDetails),
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
