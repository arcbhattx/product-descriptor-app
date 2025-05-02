
import type { NextApiRequest, NextApiResponse } from "next";

import clientPromise from '@/lib/mongodb';
import {verifyIdtoken} from '@/lib/verifyToken';


export default async function handler(req: NextApiRequest, res:NextApiResponse) {

    const token = req.headers.authorization?.split("Bearer ")[1]


    if(!token) return res.status(401).json({error: "Not authorzed"})

    try{

        const decode = await verifyIdtoken(token);

        const data_body = req.body;
    
        const client = await clientPromise;

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION!);

       // const results = await collection.updateOne({
       //})

        //res.status(200).json({ message: "Product inserted", results });

    }catch(error){

    }

    
}