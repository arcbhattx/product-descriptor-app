import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
      }

  
    const data_body = req.body;
    console.log(data_body);

    try{
        const client = await clientPromise;

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION);

        const result = await collection.findOne({
            product_name: "kitchen",
        })

        res.status(200).json({ product: result });
    }catch (error) {
        console.error("Error inserting product:", error);
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
}
