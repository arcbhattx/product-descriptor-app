import * as admin from "firebase-admin";

if(!admin.apps.length){
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail:process.env.NEXT_PUBLIC_CLIENT_EMAIL,
            privateKey:process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
        }), 
    });
}

export const verifyIdtoken = async (idToken: string) =>{
    try{
        const decodecToken = await admin.auth().verifyIdToken(idToken)
        return decodecToken;
    }catch(err){
        throw new Error("Invalid or expired token");
    }
};

