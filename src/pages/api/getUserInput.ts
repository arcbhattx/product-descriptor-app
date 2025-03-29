import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const data_body = req.body;
        console.log(data_body);
        return res.status(200).json({ message: "success" });
    }

    // ✅ Send response for non-POST requests too
    return res.status(405).json({ error: "Method Not Allowed" });
}
