'use client'
import * as React from "react"
import {  LogOut  } from "lucide-react"
import {useRouter} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormField, FormItem, FormLabel, FormControl,FormDescription, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"


export default function MainPage(){

    const router = useRouter();
    
    const [open, setOpen] = React.useState(false);


    const productForm = useForm({
        defaultValues:{
            product_name: "",
            tags: [],
            description: "",
        }
    });

    const handleNavigation = () => {
        router.push("/");
    }

    const handleForm = () => {
        console.log("Submitted values")
    }



    return (
        <div className="flex flex-col space-x-4">

        <div className="relative">

            <div className="absolute top-4 right-20 ">

            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            </div>

            <div className="absolute top-4 right-4">
                <Button onClick={handleNavigation}>
                <LogOut />
                </Button>
            </div>
        </div>

        

          <div className="flex flex-row items-center justify-center space-x-4 gap-4 mt-20">
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
          </div>
      
        </div>
      );
      
}