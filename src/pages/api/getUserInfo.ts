import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

 
    const data_body = req.body;
    console.log(data_body);

    try{
        const client = await clientPromise;

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION!);

        const result = await collection.findOne({
            product_name: "cup",
            tags: "kitchen",
            description: "its a cup"
        })

        res.status(200).json([result]);
    }catch (error) {
        console.error("Error inserting product:", error);
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
}
