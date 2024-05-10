"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";

import { useTaskStore } from "@/lib/store";
import { useState } from "react";
import {useRouter} from "next/navigation"
export default function MyDialog() {
    const router = useRouter();
    const [step,setStep] = useState("");
  const addTask = useTaskStore((state) => state.addTask);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const { title, description } = Object.fromEntries(formData);

    if (typeof title !== "string" || typeof description !== "string") return;
    addTask(title, description);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          ＋ MICROPHONE
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
            {/* <form
              id="todo-form"
              className="grid gap-4 py-4"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="title"
                  name="title"
                  placeholder="Todo title..."
                  className="col-span-4"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description..."
                  className="col-span-4"
                />
              </div>
            </form> */}
            <DialogFooter>
              <div className="flex justify-around">
                <Button onClick={()=> {
                    setStep("add");
                }} size="sm">
                  Add
                </Button>
                <Button size="sm">
                  Increment
                </Button>
                <Button size="sm">
                  Decrement
                </Button>
                <Button size="sm">
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
          <div className="flex justify-between">
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
    </Dialog>
  );
}
