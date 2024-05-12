"use client";
import clientConnectionWithSupabase from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
// import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import { updateProduct } from "@/app/api/db/apis";
// import { useTaskStore } from "@/lib/store";
import { useState } from "react";
import {useRouter} from "next/navigation"
export default function MyDialog() {
  const { toast } = useToast();

    const router = useRouter();
    const [step,setStep] = useState("");
    const [name,setName] = useState("");
    const [brand,setBrand] = useState("");
    //new
    // const [newBrand,setNewBrand] = useState("");
    // const [newName,setNewName] = useState("");
    const [newQuantity,setNewQuantity] = useState("");

  const handleDelete = async () => {
    const supabase = clientConnectionWithSupabase();
    const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
    console.log("Attempting to delete item with name:", name, "and brand:", brand);
    try {
        const { error } = await supabase
            .from("inventory")
            .delete()
            .match({ product_name: name, brand: brand, user_id : user.user_id });

        if (error) {
            console.error("Delete error:", error);
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
            });
        } else {
           // console.log("product", res);
           toast({
            variant: "default",
            title: "successful",
            description: "Item has been deleted",
          });
            // Optionally refresh the list or clear the form
            setName('');
            setBrand('');
            // Refresh your product list if applicable
            // router.push("/dashboard/product")
        }
    } catch (e) {
        console.error("Deletion error:", e);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
    }
};
const handleUpdate = async () => {
  const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
  console.log("Attempting to updateitem with name:", name, "and brand:", brand);
  const formData = {
    // 'product_name' : newName,
    // 'brand' : newBrand,
    'quantity' : Number(newQuantity),
  }
  try {
    const result = await updateProduct(name, brand, user.user_id , formData);
    
    if (result.success) {
      console.log("Update successful", result.data);
      toast({
        variant: "default",
        title: "successful",
        description: "Item has been updated",
      });
        // Optionally refresh the list or clear the form
        setName('');
        setBrand('');
    } else {
      console.error("Failed to update", result.error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  } catch (e) {
      console.error("updation error:", e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
  }
};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          ＋ OPERATIONS 
        </Button>
      </DialogTrigger>
      {step == "" && (
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Operation</DialogTitle>
              <DialogDescription>
                What do you want to get done today?
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <div className="flex justify-around">
                <Button onClick={()=> {
                    setStep("add");
                }} size="sm">
                  Add
                </Button>
                <Button onClick={()=> {
                    setStep("update");
                }} size="sm">
                  Update
                </Button>
                <Button size="sm" onClick={()=> {
                    setStep("delete");
                }}>
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      {step == "add" && (
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add</DialogTitle>
          <DialogDescription>
            How would you like to add
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-between space-y-2">
            <Button onClick={()=> {
                router.push(`/dashboard/product/create`)
            }} size="sm">
              using text
            </Button>
            <Button onClick={()=> {
                router.push(`/dashboard/product/createaudio`)
            }} size="sm">
              using voice
            </Button>
            <Button size="sm">
              using image
            </Button>
            <Button size="sm" onClick={()=> {
                    setStep("");
                }}>
                back
              </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      )}
      {step=="update" && (
        <DialogContent className="sm:max-w-[425px]">
         <DialogHeader>
          <DialogTitle>Edit row</DialogTitle>
          <DialogDescription>
            Make changes to your row here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nameu" className="text-right">
              Name
            </Label>
            <Input
              id="nameu"
              className="col-span-3"
              value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="name-error"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="Brandu" className="text-right">
                Brand
              </Label>
              <Input
                id="Brandu"
                name="Brandu"
                className="col-span-3"
                placeholder="Brand"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                aria-describedby="Brand-error"
              />
            </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              New Quantity
            </Label>
            <Input
              id="quantity"
              // defaultValue="@peduarte"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild>
            <Button type="button" size="sm" onClick={()=> {
                    setStep("");
                }} variant="secondary">
              Close
            </Button>
          </DialogClose>
        <Button size="sm" onClick={()=> {
                    handleUpdate()
                    setStep("");
                }}>
                save changes
              </Button>
        </DialogFooter>
      </DialogContent>
      )}
      {step=="delete" && (
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>Fill some details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                className="col-span-3"
                placeholder="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-describedby="name-error"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="Brand" className="">
                Brand
              </Label>
              <Input
                id="Brand"
                name="Brand"
                className="col-span-3"
                placeholder="Brand"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                aria-describedby="Brand-error"
              />
            </div>
          </div>
          <DialogFooter>
          <DialogClose asChild>
            <Button type="button" size="sm" onClick={()=> {
                    setStep("");
                }} variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button variant={"destructive"} size="sm" onClick={()=> {
                    handleDelete()
                    setStep("");
                }}>
                delete
              </Button>
          </DialogFooter>
        </div>
      </DialogContent>
      )}
    </Dialog>
  );
}
