import Image from "next/image";
import {Menubar}from "@/components/ui/menubar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {Button} from "@/components/ui/button";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <Card className="w-[350px] ">
      <CardHeader className="text-center">
        <CardTitle className="font-mono p-3">Welcome to Descripto</CardTitle>
        <CardDescription className = "font-mono"> A product descriptor app to help maximize your earnings. </CardDescription>
      </CardHeader>
    </Card>

    <div className="p-4"> 
      <Button> Get Started</Button>
    </div>
    </div>

  );
}
