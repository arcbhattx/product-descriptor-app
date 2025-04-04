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
    const [token, setToken] = useState<string | null>(null);
    const [airesponse, setAIresponse] = useState('');

    const [data, setData] = useState<any[]>([]);

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
    }, [router])
    


    const productForm = useForm({
        defaultValues:{
            product_name: "",
            tags:[] as string[],
            description: "",
        }
    });

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    const addTag = () => {
        const updatedTags = [...tags, tagInput.trim()];
        setTags(updatedTags);
        productForm.setValue("tags", updatedTags);

    }

    const removeTag = (currTag: string) => {
        const updatedTags = tags.filter(tag => tag !== currTag);
        setTags(updatedTags);
        productForm.setValue("tags", updatedTags);
      };
      

    const navAccout = () => {
        router.push("/account");
    }

    const handleForm = async (values: any) => {

        try{

            const response = await fetch("/api/addUserInput", {
                method: "POST",
                headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"},
                body: JSON.stringify(values),
            })
    
            const data_response = await response.json();
            console.log("Server response", data_response)

            await getProductData(); // Fetch the updated data after submission
            await processData(values);

        }catch(error){  
            alert(error)
        }
    }

    const getProductData = async () => {

        console.log("hiii")
        try {
          const response = await fetch("/api/getUserInfo", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, 
                "Content-Type": "application/json"
              },
          });
      
          const data_response = await response.json(); //  must await here
          console.log("Server response", data_response);
      
          setData(data_response); // assuming data_response is what you expect
        } catch (error) {
          console.error("Error fetching data:", error);
        }
    };

    const processData = async (values: any) => {

        try {
            const response = await fetch("/api/aiProcess", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
          
            const data = await response.json();
            setAIresponse(data);
          
          } catch (error) {
            console.log(error);
          }
    }

    if (!user) {
        return <div>Checking login status...</div>;
    }    

    return (

        <div className="flex flex-row h-screen">


                <Card className="top-0 left-0 h-screen w-[200px]">


                    <CardHeader> 
                        <CardTitle className="text-center"> Products </CardTitle>
                    </CardHeader>

                </Card>

                <div className="flex flex-col flex-1">

                    <Card className="h-16 flex flex-row items-center justify-center px-6">
                        
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





                    <div className="flex flex-row gap-2">
                    <Card className="w-full h-full">
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
                                    <div className="flex flex-col gap-4">

                                        <div className='flex flex-row gap-2'>
                                            <Input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addTag();
                                                }
                                                }}
                                                placeholder="Enter a tag"
                                            />
                                            <Button
                                                type="button"
                                                onClick={addTag}
                                                className="px-3 py-1 border rounded"
                                            >
                                                +
                                            </Button>
                                            
                                    </div>

                                    <div>
                                        <Card className="p-4 max-h-20 overflow-y-auto">
                                            <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (

                                            <div
                                            key={index}
                                            className="flex items-center gap-2 bg-white text-black text-sm px-3 py-1 rounded-full border shadow-sm"
                                            >
                                            <span>{tag}</span>
                                            <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="w-5 h-5 p-0 text-xs text-black-500 hover:text-red-700"
                                            onClick={() => removeTag(tag)}
                                            >
                                            ×
                                            </Button>
                                            </div>
                                            ))}
                                            </div>
                                        </Card>
                                        </div>

                                        
                                    </div>
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

                    <Card className="w-full h-full">
                        <CardHeader>
                            <CardTitle> Chat </CardTitle>
                        </CardHeader>
                    <CardContent className="flex flex-col gap-5">

                        <Card className="h-[350px]"> 

                            <CardContent >
                            
                            {airesponse}
                        
                                    
                            </CardContent>

                        </Card>

                    <Input type="text" placeholder="type in chat" />

                    </CardContent>


                    </Card>
                    </div>

                </div>

        </div>
        
      );
      
}

/*

 {data && data.length > 0 ? (


                    data[0].map((product: any, index: number) => (
                        <div key={index}>
                        <div><strong>Name:</strong> {product.product_name}</div>
                        <div><strong>Tags:</strong> {product.tags.join(' , ')}</div>
                        <div><strong>Description:</strong> {product.description}</div>
                        </div>
                    ))
                    ) : (
                    <div className="text-gray-400">No product data yet.</div>
                    )}


*/