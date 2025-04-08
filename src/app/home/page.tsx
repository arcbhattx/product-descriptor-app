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


  import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
 
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
  } from "@/components/ui/sidebar"


import { useState, useEffect} from "react"
import type {User} from "firebase/auth";

export default function MainPage(){

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
    const [airesponse, setAIresponse] = useState('');

    const [data, setData] = useState<any[]>([]);

    const [position, setPosition] = useState("bottom")

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
            voice_tone: ""
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

    const items = [
        {
          title: "Home",
          url: "#",
          icon: Home,
        },
        {
          title: "Inbox",
          url: "#",
          icon: Inbox,
        },
        {
          title: "Calendar",
          url: "#",
          icon: Calendar,
        },
        {
          title: "Search",
          url: "#",
          icon: Search,
        },
        {
          title: "Settings",
          url: "#",
          icon: Settings,
        },
      ]

    return (
        <div className='flex flex-row gap-20 min-w-[200vh]'>

                    <SidebarProvider>
                        <Sidebar>
                        <SidebarContent>
                            <SidebarGroup>
                            <SidebarGroupLabel>Application</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                        <item.icon />
                                        <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                        </Sidebar>
                    </SidebarProvider>


                <div className="flex flex-col">
                    <Card className="flex flex-row items-center justify-center px-6 w-screen h-10">
                                
                                <CardTitle className="text-bold font-semibold">
                                    Welcome to Descriptor
                                </CardTitle>

                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="rounded-full w-7 h-7 p-0 font-bold">
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

                    <div className="grid grid-cols-2 ">

                        <Card className="">
                            <CardHeader>
                                <CardTitle>
                                    Product Input
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <Form {...productForm}>
                                    <form onSubmit={productForm.handleSubmit(handleForm)}> 
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

                                    <FormField
                                        control={productForm.control}
                                        name="voice_tone"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Writing Tone</FormLabel>
                                            <FormControl>
                                            <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                    <Button variant="outline">Writing Tone</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-56">
                                                    <DropdownMenuLabel>Tones</DropdownMenuLabel>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuRadioGroup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    >

                                                    <DropdownMenuRadioItem value="Formal">Formal</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="Friendly">Friendly</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="Casual">Casual</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="Proffesional">Proffesional</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="Engaging">Engaging</DropdownMenuRadioItem>
                                                    <DropdownMenuRadioItem value="Pursuasive">Pursuasive</DropdownMenuRadioItem>

                                                    </DropdownMenuRadioGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                            </FormControl>
                                            <FormDescription>Select how you want to sound</FormDescription>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>  
                                </form>  
                            </Form>

                            </CardContent>
                        </Card>


                        <Card className="">
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