'use client'

import {Button} from "@/components/ui/button"
import {  LogOut  } from "lucide-react"
import {useRouter} from 'next/navigation';
import {signOut} from "firebase/auth";
import {auth} from "../../../firebase/clientApp"

import {useState, useEffect} from "react"

import type {User} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


export default function Account(){

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe_listener = onAuthStateChanged( auth, (user) => {
            if(user){
                setUser(user);
            }else{
                router.push("/login")
            }
        })
        
        return () => unsubscribe_listener();
    }, [router])

        
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

    if (!user) {
        return <div>Checking login status...</div>;
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