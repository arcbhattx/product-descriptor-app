import {Card, CardTitle} from "@/components/ui/card"

import {Button} from "@/components/ui/button"

import { useState, useEffect } from "react";

import {useRouter} from "next/navigation"

import {onAuthStateChanged, type User} from "firebase/auth";
import {auth} from "../../firebase/clientApp";

export function AppHeader(){

    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        
      const unsubscribe_listener = onAuthStateChanged(auth, (user) => {
          if(user){ //loggedin
              setUser(user);
              (async () => {
                  const idToken = await user.getIdToken();
                  setToken(idToken);
                })();
          }else{
              router.push("/login");
          }
      })

      return () => unsubscribe_listener();

    } ,[router])


    const navAccout = () => {
        router.push("/account");
    }

    return(
        <>

        <Card className="flex flex-row items-center justify-between px-6 py-4 shadow-md bg-color-black">
            <CardTitle className="text-lg font-semibold">
              Welcome to Descriptor
            </CardTitle>
  
           
                <Button onClick={navAccout} className="rounded-full w-8 h-8 p-0 font-bold">
                  AB
                </Button>
           
        
          </Card>
        
        </>
    )

}
