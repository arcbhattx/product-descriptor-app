'use client'
import * as React from "react"

import {Button} from "@/components/ui/button"
import {  LogOut  } from "lucide-react"
import {useRouter} from 'next/navigation';
import {signOut} from "firebase/auth";
import {auth} from "../../../firebase/clientApp"


export default function account(){


    const router = useRouter();
        
    const [open, setOpen] = React.useState(false);
    const handleNavigation = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            // Optional: redirect to login or homepage
            // router.push("/sign-in");
          } catch (error) {
            console.error("Error signing out:", error);
        }
        router.push("/");
    }


    return (
        <div>

            <div className="absolute top-4 right-4">
                    <Button onClick={handleNavigation}>
                            <LogOut />
                    </Button>
            </div>
            
        </div>
    )
}