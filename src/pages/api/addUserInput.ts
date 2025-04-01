import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  
    const data_body = req.body;
    console.log(data_body);

    try{
        const client = await clientPromise;

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        const results = await collection.insertOne({
            product_name: data_body.product_name,
            tags: data_body.tags,
            description: data_body.description
        })

        res.status(200).json({ message: "Product inserted", results });
    }catch (error) {
        console.error("Error inserting product:", error);
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
}
