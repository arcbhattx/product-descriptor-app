import {Card, CardTitle} from "@/components/ui/card"

import {Button} from "@/components/ui/button"

import { useState, useEffect } from "react";

import {useRouter} from "next/navigation"

import type {User} from "firebase/auth";

export function AppHeader(){

    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);

    const navAccout = () => {
        router.push("/account");
    }

    return(
        <>

        <Card className="flex flex-row items-center justify-between px-6 py-4 shadow-md mb-6">
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
