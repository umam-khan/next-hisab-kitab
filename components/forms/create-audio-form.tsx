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
  const onCreate = async () => {
    if (audioFile.current) {
      const formData = new FormData();
      formData.append('file', audioFile.current);
      formData.append('language', 'Hindi');
      formData.append('operation', 'add');
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/get_details', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        setProduct_name(result.message.product_name);
        setBrand(result.message.brand);
        setCategory(result.message.category);
        setQuantity(result.message.quantity);
        setNetweight(result.message.Netweight);
        setThreshold(result.message.threshold);
        setPrice(result.message.price);

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
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const formdata = {
        'brand': brand,
        'quantity': Number(quantity),
        'netweight': netweight,
        'category': category,
        'price':Number(price),
        'product_name': product_name,
        'threshold' : Number(threshold),
        'Language' : 'Hindi',
        'user_id' : 'f1f35a09-0c4a-4378-9693-a82047a2b629'
      }
      const result = await createProduct(formdata)
      console.log(`after insert : ${result}`)
      if (result.success) {
        setLoading(false);
        toast({
          variant: "default",
          title: "successful",
          description: "Item has been added",
        });
        // await axios.post(`/api/products/edit-product/${initialData._id}`, data);
        router.push(`/dashboard/product`);
      } else {
        // const res = await axios.post(`/api/products/create-product`, data);
        // console.log("product", res);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
      // router.refresh();
      
      
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
      <Heading title={'Add New Product'} description="Use your voice to record the data" />
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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
                      {...field}
                      value={product_name}
                      onChange={(e) => {
                        setProduct_name(e.target.value)
                    }}
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
                      value={brand}
                      onChange={(e) => 
                        { 
                          setBrand(e.target.value)
                        }}
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
                      value={category} 
                      onChange={(e) => {
                        setCategory(e.target.value)
                    }}
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
                      value={quantity} 
                      onChange={(e) => {
                        setQuantity(e.target.value)
                    }}
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
                      value={netweight}
                      onChange={(e) => {
                        setNetweight(e.target.value)
                    }}
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
                      value={threshold}
                      onChange={(e) => {
                        setThreshold(e.target.value)
                    }}
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
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                    }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-around">
          <Button type="button" onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Button type="button" onClick={onCreate} disabled={loading} className="ml-auto">
            {initialData ? 'Save Changes' : 'Fill Form'}
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
