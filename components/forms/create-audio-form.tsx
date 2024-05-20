'use client'
import { AudioRecorder } from 'react-audio-voice-recorder';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { createProduct } from "@/app/api/db/apis";

const formSchema = z.object({
  product_name: z.string(),
  brand: z.string(),
  price: z.string(),
  category: z.string(),
  quantity: z.string(),
  threshold: z.string(),
  netweight: z.string(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

const ProductAudioForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioFile = useRef<File | null>(null);

    //form states
  const [product_name, setProduct_name] = useState<string>("")
  const [brand, setBrand] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [netweight, setNetweight] = useState<string>("")
  const [price, setPrice] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [threshold, setThreshold] = useState<string>("")

  // Initialize form with useForm hook
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      product_name: "",
      brand: "",
      category: "",
      quantity: "",
      netweight: "",
      threshold: "",
      price: "",
    },
  });
  // const onCreate = async () => {
  //   if (audioFile.current) {
  //     const formData = new FormData();
  //     formData.append('file', audioFile.current);
  //     formData.append('language', 'Hindi');
  //     formData.append('operation', 'add');
  //     try {
  //       setLoading(true);
  //       const response = await fetch('http://localhost:8000/get_details', {
  //         method: 'POST',
  //         body: formData,
  //       });
  //       const result = await response.json();
  //       console.log(result)
  //       setProduct_name(result.message.product_name);
  //       setBrand(result.message.brand);
  //       setCategory(result.message.category);
  //       setQuantity(result.message.quantity);
  //       setNetweight(result.message.Netweight);
  //       setThreshold(result.message.threshold);
  //       setPrice(result.message.price);

  //       toast({
  //         variant: "default",
  //         title: "Form Updated",
  //         description: "Form fields have been updated with audio transcription results",
  //       });
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error submitting audio file:', error);
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "There was an error processing your request",
  //       });
  //       setLoading(false);
  //     }
  //   }
  // };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      const audioChunks : any = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks);
        audioFile.current = new File([audioBlob], 'recording.mp3', { type: 'audio/mp3' });
      };
    } catch (error) {
      console.error('Error starting audio recording:', error);
    }
  };

  const stopRecording = async() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      console.log("recording done")
    }
  };

  const onCreate = async () => {
    if (audioFile.current) {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;

      const formData = new FormData();
      formData.append('file', audioFile.current);
      formData.append('language', user.language);
      formData.append('operation', 'add');
      try {
        setLoading(true);
        const response = await fetch('http://34.204.63.54/get_details', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        console.log(result);
        // Use setValue from react-hook-form to update the form fields
        // form.setValue('product_name', result.message.Name);
        // form.setValue('brand', result.message.Brand);
        // form.setValue('category', result.message.Category);
        // form.setValue('quantity', result.message.Quantity);
        // form.setValue('netweight', result.message.Netweight);
        // form.setValue('threshold', result.message.Threshold);
        // form.setValue('price', result.message.Price);
        form.reset({
          product_name: result.message.Name || '',
          brand: result.message.Brand || '',
          category: result.message.Category || '',
          quantity: result.message.Quantity ? result.message.Quantity.toString() : '0',
          netweight: result.message.Netweight || '',
          threshold: result.message.Threshold ? result.message.Threshold.toString() : '0',
          price: result.message.Price ? result.message.Price.toString() : '0'
      });
      
        
        console.log(form.getValues())
        toast({
          variant: "default",
          title: "Form Updated",
          description: "Form fields have been updated with audio transcription results",
        });
        setLoading(false);
      } catch (error) {
        console.error('Error submitting audio file:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an error processing your request",
        });
        setLoading(false);
      }
    }
  };

  
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      
      // Retrieve user details from local storage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      
      if (!user || !user.user_id || !user.language) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Missing user data. Please log in again.",
        });
        setLoading(false);
        return;
      }
      const formData = {
        'brand': data.brand,
        'quantity': Number(data.quantity),
        'netweight': data.netweight,
        'category': data.category,
        'price': Number(data.price),
        'product_name': data.product_name,
        'threshold': Number(data.threshold),
        'Language': user.language,  // Assuming 'user' is correctly defined and contains 'language'
        'user_id': user.user_id     // Assuming 'user' is correctly defined and contains 'user_id'
      };
      console.log(`formdata before submitting: `, formData);
      // const formdata = {
      //   'brand': brand,
      //   'quantity': Number(quantity),
      //   'netweight': netweight,
      //   'category': category,
      //   'price': Number(price),
      //   'product_name': product_name,
      //   'threshold': Number(threshold),
      //   'Language': user.language, // Set from local storage
      //   'user_id': user.user_id   // Set from local storage
      // }
      // console.log(`formdata before submitting : ${formdata.brand},${formdata.threshold}, `)
      const result = await createProduct(formData);
      console.log(`after insert : ${result}`);
      if (result.success) {
        setLoading(false);
        toast({
          variant: "default",
          title: "Successful",
          description: "Item has been added",
        });
        router.push(`/dashboard/product`);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col">
      <Heading
        title={"Add New Product"}
        description="Use your voice to record the data"
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name"
                      {...field} // This already includes value, onChange, ref and should not be overridden
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="brand"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="category"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="netweight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="netweight"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="threshold"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-around">
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button
              type="button"
              onClick={onCreate}
              disabled={loading}
              className="ml-auto"
            >
              {initialData ? "Save Changes" : "Fill Form"}
            </Button>
            <Button disabled={loading} className="ml-auto" type="submit">
              submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductAudioForm;
