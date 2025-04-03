import OpenAI from "openai";
import { NextApiResponse, NextApiRequest } from "next";
import clientPromise from '@/lib/mongodb';
import {verifyIdtoken} from '@/lib/verifyToken';


const client = new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export default async function handler( req: NextApiRequest, res: NextApiResponse ){

    const token = req.headers.authorization?.split("Bearer ")[1]

    if(!token) return res.status(401).json({error: "Not authorzed"})

    try{
        
        const decode = await verifyIdtoken(token)

        const response = await client.responses.create({
            model: "gpt-4o",
            input: "Write me a product description for an iphone in 2 lines.",
        })

        res.status(200).json(response)

    }catch (error) {
        console.error("Error inserting product:", error);
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    } 

}

