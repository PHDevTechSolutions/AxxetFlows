import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';

// Set up Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function Edit(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, ReferenceNumber, ProductName, ProductSKU, ProductDescription, ProductCategories, ProductQuantity, ProductCostPrice, ProductSellingPrice, 
        ProductStatus, ProductImage } = req.body;

    try {
        const db = await connectToDatabase();
        const DataCollection = db.collection('Products');

        // Create the update data object
        const UpdateData: any = {
            ReferenceNumber,
            ProductName,
            ProductSKU,
            ProductDescription,
            ProductCategories,
            ProductQuantity,
            ProductCostPrice,
            ProductSellingPrice,
            ProductStatus,
            updatedAt: new Date(),
        };

        // If a new image is provided, upload it to Cloudinary and update the ProductImage field
        if (ProductImage && ProductImage !== '') {
            // Upload the new image to Cloudinary
            const result = await cloudinary.v2.uploader.upload(ProductImage, {
                folder: 'products',
            });

            // Update the ProductImage field with the new image URL
            UpdateData.ProductImage = result.secure_url;
        }

        // Ensure the _id is an ObjectId type
        const objectId = new ObjectId(id);

        // Update the document in MongoDB
        await DataCollection.updateOne({ _id: objectId }, { $set: UpdateData });

        res.status(200).json({ success: true, message: 'Report Item Updated Successfully' });
    } catch (error) {
        console.error('Error updating Data:', error);
        res.status(500).json({ error: 'Failed to update Data' });
    }
}
