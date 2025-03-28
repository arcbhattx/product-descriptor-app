'use client'

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {Button} from "@/components/ui/button";
import {useRouter} from 'next/navigation';

import D from "@/assets/D.png"




export default function Home() {

  const router = useRouter();

  const handleNavigation = () => {
    router.push('/home');
  };



  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <Image src={D} alt="D logo" width={200} height={200} />
      <Card className="w-[350px] ">
      <CardHeader className="text-center">
        <CardTitle className="font-mono p-3">Welcome to Descripto</CardTitle>
        <CardDescription className = "font-mono"> A product descriptor app to help maximize your earnings. </CardDescription>
      </CardHeader>
    </Card>

    <div className="p-4"> 
      <Button onClick={handleNavigation}> Get Started</Button>
    </div>
    </div>

  );
}
