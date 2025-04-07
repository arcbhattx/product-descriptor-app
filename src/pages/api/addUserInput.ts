import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import {verifyIdtoken} from '@/lib/verifyToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const token = req.headers.authorization?.split("Bearer ")[1]

    if(!token) return res.status(401).json({error: "Not authorzed"})


    try{
        const decode = await verifyIdtoken(token);

        const data_body = req.body;
    
        const client = await clientPromise;

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION!);

        const results = await collection.insertOne({
            uid: decode.uid,
            product_name: data_body.product_name,
            tags: data_body.tags,
            description: data_body.description,
            voice_tone: data_body.voice_tone,
            createdAt: new Date()
        })

        res.status(200).json({ message: "Product inserted", results });
    }catch (error) {
        console.error("Error inserting product:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
