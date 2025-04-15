import {Button} from "@/components/ui/button"
import { useEffect, useState } from "react"

import {User} from "firebase/auth";
import {auth} from "../../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

import { useRouter} from "next/navigation";

import clientPromise from "@/lib/mongodb";

import {Card, CardDescription, CardTitle} from "@/components/ui/card";


export function AppSidebar(){


    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<String | null>(null);

    const router = useRouter();
 
    const [products, setProducts] = useState<String[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const[isModalOpen, setIsModalOpen] = useState(false);

    const[currentProudctIndex, setCurrentProductIndex] = useState(0);

    

    type Product = {
        //_id: string;
        //uid: string;
        product_name: string;
        generated_description: string;
    };

    const [productData, setProductData] = useState<Product[]>([]);

    useEffect( () => {

        const unsubscribe_listener = onAuthStateChanged(auth, (user) => {
            if(user){
                setUser(user);
                (async () => {
                    const idToken = await user.getIdToken();
                    setToken(idToken);
                    await getUserProducts(idToken);
                
                  })(); 

                  
            }else{
            router.push("/login");
        }
        })

        return () => unsubscribe_listener();
    }, [router])

    const  getUserProducts = async (token: string) => { //pass in the auth token

        try{
 
            const response = await fetch("/api/getUserInfo", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json"
                },
            });

            const json = await response.json(); // type: any
            const data_response: Product[][] = json;
            setProductData(data_response[0]);
            setProductData(data_response.flat()); // ✅ still Product[]

            console.log(data_response)



        }catch(error){

            console.log("unable to fetch products", error);

        }

    }

    const toggleDropDown = () =>{
        setIsOpen(!isOpen); 
    }

    const toggleModal = () => {

        setIsModalOpen(!isModalOpen);
    }

    const currentIndex = (index: number) => {
        setCurrentProductIndex(index)
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

                            {productData.map((product,index) => (
                            <Button onClick={ () =>{toggleModal(), currentIndex(index)}} key={product.product_name} className="bg-black text-white">
                                {product.product_name}
                            </Button>
                            ))}

                                {isModalOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
                                    <Card className="w-[400px] p-6">
                                    <CardTitle className="flex flex-row items-center justify-between px-6 py-4 shadow-md bg-color-black">
                                        {productData[currentProudctIndex].product_name}
                                        <Button onClick={toggleModal}> 
                                            x
                                        </Button>
                                    </CardTitle>
                                    <CardDescription>
                                        
                                        Description:

                                        {productData[currentProudctIndex].generated_description}

                        
                                    </CardDescription>
                                    </Card>
                                </div>
                                )}



                            </div>

                                
  
                        )}
                            

                        <Button variant="ghost" className="w-full justify-start text-white">Settings</Button>
                    </nav>
            </aside>
        
        </>
    )

}