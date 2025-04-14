import {Button} from "@/components/ui/button"
import { useEffect, useState } from "react"

import {User} from "firebase/auth";
import {auth} from "../../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

import { useRouter} from "next/navigation";


export function AppSidebar(){

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<String | null>(null);

    const router = useRouter();
 
    const [products, setProducts] = useState<String[]>(["Product1", "Product2", "Product 3"]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect( () => {

        const unsubscribe_listener = onAuthStateChanged(auth, (user) => {
            if(user){
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
    }, [router])

    const getUserProduct =() => {

        try{

        }catch(error){

        }

    }

    const toggleDropDown = () =>{
        setIsOpen(!isOpen); 
    }

    return(

        <>
            <aside className="w-64 text-white p-6 space-y-6 shadow-md">

                <h2 className="text-xl font-bold">Descriptor</h2>

                    <nav className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start text-white">Dashboard</Button>
                        <Button onClick={toggleDropDown} variant="ghost" className="w-full justify-start text-white">Products</Button>

                        {isOpen && (

                            <div className="flex flex-col">

                                {products.map((product, index) => (
                                    <Button key={index} className="bg-black text-white"> {product}</Button>
                                ))}


                            </div>
                           
                        )}
                            

                        <Button variant="ghost" className="w-full justify-start text-white">Settings</Button>
                    </nav>
            </aside>
        
        </>
    )

}