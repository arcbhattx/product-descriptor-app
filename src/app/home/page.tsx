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
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
  } from "@/components/ui/dropdown-menu"



import { useState, useEffect} from "react"
import type {User} from "firebase/auth";

import { AppSidebar } from '@/components/app-siderbar';
import { AppHeader } from "@/components/app-header"

export default function MainPage(){

    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const [token, setToken] = useState<string | null>(null);
    const [airesponse, setAIresponse] = useState('');

    const [data, setData] = useState<any[]>([]);

    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

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
    

    //Input Form Values
    const productForm = useForm({
        defaultValues:{
            product_name: "",
            tags:[] as string[],
            description: "",
            voice_tone: "",
            target_audience: ""
        }
    });

 

    //Add tags to array
    const addTag = () => {
        const updatedTags = [...tags, tagInput.trim()];
        setTags(updatedTags);
        productForm.setValue("tags", updatedTags);

    }

    //Remove a tag if its canceled from the input form.
    const removeTag = (currTag: string) => {
        const updatedTags = tags.filter(tag => tag !== currTag);
        setTags(updatedTags);
        productForm.setValue("tags", updatedTags);
      };
      


    //sends a request to the backend to add user input.
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

    //Gets the entered user data.
    const getProductData = async () => {

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

    //This handles the creation of the description, AI process

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

    //Just a loading thing.

    if (!user) {
        return <div>Checking login status...</div>;
    }    

    return (
        <div className="flex min-h-screen">

        {/* Sidebar */}
        <AppSidebar/>
  
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">

          {/* Header */}
          <AppHeader/>
          
        
          {/* Product Input Section */}
          <Card className="w-full bg-color-black">
            <CardHeader>
              <CardTitle>Product Input</CardTitle>
            </CardHeader>
  
            <CardContent className="flex flex-col lg:flex-row gap-6">
              {/* Form */}
              <Form {...productForm}>
                <form
                  onSubmit={productForm.handleSubmit(handleForm)}
                  className="flex flex-col gap-6 w-full max-w-xl"
                >
                  <FormField
                    control={productForm.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={productForm.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Product Tags</FormLabel>
                        <FormControl>
                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                              <Input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    addTag()
                                  }
                                }}
                                placeholder="Enter a tag"
                              />
                              <Button type="button" onClick={addTag}>
                                +
                              </Button>
                            </div>
  
                            <Card className="p-3 max-h-24 overflow-y-auto ">
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
                                      className="w-5 h-5 p-0 text-xs"
                                      onClick={() => removeTag(tag)}
                                    >
                                      ×
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          </div>
                        </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <FormField
                    control={productForm.control}
                    name="voice_tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Writing Tone</FormLabel>
                        <FormControl>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline">
                                {field.value || "Select Tone"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>Tones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                {["Formal", "Friendly", "Casual", "Professional", "Engaging", "Persuasive"].map((tone) => (
                                  <DropdownMenuRadioItem key={tone} value={tone}>
                                    {tone}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={productForm.control}
                    name="target_audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input placeholder="Input Target Audience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
  
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
  
              {/* AI Output */}
              <Card className="w-full max-w-md min-h-[350px] bg-color-black">
                <CardHeader>
                  <CardTitle>AI Output</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap">
                  {airesponse}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
          
        </main>
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