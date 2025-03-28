'use client'

import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormItem, FormLabel, FormControl,FormDescription, FormMessage} from "@/components/ui/form";

import { useForm } from "react-hook-form"


import {auth} from "../../../firebase/clientApp";
import { onAuthStateChanged } from "firebase/auth";

import { Input } from "@/components/ui/input"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

  import { useState, useEffect} from "react"
  import type {User} from "firebase/auth";

export default function MainPage(){

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe_listener = onAuthStateChanged(auth, (user) => {
            if(user){ //loggedin
                setUser(user);
            }else{
                router.push("/login");
            }
        })

        return () => unsubscribe_listener();
    }, [router])
    


    const productForm = useForm({
        defaultValues:{
            product_name: "",
            tags: [],
            description: "",
        }
    });

    const navAccout = () => {
        router.push("/account");
    }

    const handleForm = () => {
        console.log("Submitted values")
    }

    if (!user) {
        return <div>Checking login status...</div>;
    }    



    return (
        <div className="flex flex-col mt-5 items-center justify-center">

            <Card className="h-16 flex flex-row items-center justify-center px-6 shadow-md rounded-2xl w-[600px] h-[120px]">
                <CardTitle className="text-base font-semibold">
                Welcome, {user.email}
                </CardTitle>

                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="rounded-full w-10 h-10 p-0 font-bold">
                        AB
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 mt-2">
                    <DropdownMenuItem onClick={navAccout}>
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </Card>



        

          <div className="flex flex-row items-center justify-center space-x-4 gap-4 mt-5">
            <Card className="w-[500px] h-[500px]"> 
                <CardHeader>
                    <CardTitle>
                        Product Input
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   <Form {...productForm}>
                        <form onSubmit={productForm.handleSubmit(handleForm)} className="w-2/3 space-y-6"> 
                        <FormField
                            control={productForm.control}
                            name="product_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter product name" {...field} />
                                </FormControl>
                                <FormDescription>What is your Product Called?</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
    
                        <FormField
                        control={productForm.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Product Tags</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter tags" {...field} />
                            </FormControl>
                            <FormDescription>Types in the tags your product is associated with</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={productForm.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product description" {...field} />
                            </FormControl>
                            <FormDescription>Briefly describe your product</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit">Submit</Button>  
                    </form>  
                   </Form>
                </CardContent>
            </Card>

            <Card  className="w-[500px] h-[500px]"> 
                <CardHeader>
                    <CardTitle> Chat </CardTitle>
                </CardHeader>
               <CardContent className="flex flex-col gap-5">
                <Card className="h-[350px]"> 

                </Card>

               <Input type="text" placeholder="type in chat" />

               </CardContent>


            </Card>
          </div>
      
        </div>
      );
      
}