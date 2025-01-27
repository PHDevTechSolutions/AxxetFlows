import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id, Firstname, Lastname, Email, Location, userName, Password, Role } = req.body;

  try {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");

    // Prepare updated fields
    const updatedUser: any = {Firstname, Lastname, Email, Location, userName, Role, updatedAt: new Date(),
    };

    // Hash the password only if it is provided
    if (Password) {
      updatedUser.password = await bcrypt.hash(Password, 10);
    }

    // Update user data
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    res.status(200).json({ success: true, message: "Account updated successfully" });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}
