'use client'
import * as React from "react"

import {Button} from "@/components/ui/button"
import {  LogOut  } from "lucide-react"
import {useRouter} from 'next/navigation';


export default function account(){


    const router = useRouter();
        
    const [open, setOpen] = React.useState(false);
    const handleNavigation = () => {
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