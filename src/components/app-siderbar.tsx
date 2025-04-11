import {Button} from "@/components/ui/button"


export function AppSidebar(){

    return(

        <>
            <aside className="w-64 text-white p-6 space-y-6 shadow-md">

                <h2 className="text-xl font-bold">Descriptor</h2>

                    <nav className="space-y-4">
                        <Button variant="ghost" className="w-full justify-start text-white">Dashboard</Button>
                        <Button variant="ghost" className="w-full justify-start text-white">Products</Button>
                        <Button variant="ghost" className="w-full justify-start text-white">Settings</Button>
                    </nav>
            </aside>
        
        </>
    )

}