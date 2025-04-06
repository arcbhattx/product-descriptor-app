import OpenAI from "openai";
import { NextApiResponse, NextApiRequest } from "next";
import {verifyIdtoken} from '@/lib/verifyToken';
import clientPromise from '@/lib/mongodb';


const client = new OpenAI({
    apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY
});

export default async function handler( req: NextApiRequest, res: NextApiResponse ){

    const token = req.headers.authorization?.split("Bearer ")[1]

    if(!token) return res.status(401).json({error: "Not authorzed"})

    try{
        
        const decode = await verifyIdtoken(token);//verify user

        //get req body.
        const data_body = req.body;
        const { product_name, tags, description } = data_body;

        //database client
        const database_client = await clientPromise;

        //Initiallize
        const db = database_client.db(process.env.MONGODB_DB);
        const collection = db.collection(process.env.MONGODB_COLLECTION!);

        //Find User.

        const find_user_product = await collection.findOne({
            uid: decode.uid,
            product_name: product_name
        })

        //console.log(find_user_product)


        //Open AI processing
        const inputText = `Write me a product description for the following product in 2 lines:\n
        Product Name: ${product_name}
        Tags: ${tags.join(", ")}
        Description: ${description}`;

        const response = await client.responses.create({
        model: "gpt-4o",
        instructions: "Use the given input and create product description that helps attract more customers.",
        input: inputText,
        });

        //store response in database for further modificaiton. 

        const store_product_chat = await collection.updateOne({
            uid: decode.uid,
            product_name: product_name
            

            },
            {
                $set:{
                    generated_description:response.output_text
                }
            }
        )

        //send response out.
        res.status(200).json(response.output_text)
        //console.log(response.output_text)


    }catch (error) {
        console.error("Error inserting product:", error);
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    } 

}

