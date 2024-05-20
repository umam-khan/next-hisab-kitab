'use client'
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useToast } from '../ui/use-toast';
import { createProduct } from "@/app/api/db/apis";
import {useRouter } from 'next/navigation';
// import CameraDialog from './CameraDialog';
// import { DialogTrigger } from '@/components/ui/dialog';

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

const ProductCameraForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {

  const router = useRouter();

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleTakePhoto = async () => {
    if (!stream) return;

    try {
      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new (window as any).ImageCapture(videoTrack);
      const photo = await imageCapture.takePhoto();

      // Set the captured photo to the file input
      const file = new File([photo], 'photo.jpg', { type: 'image/jpeg' });
      const fileList = new DataTransfer();
      fileList.items.add(file);

      // Use a temporary variable to avoid direct assignment to an optional property
      const files = fileList.files;
      if (fileInputRef.current) {
        fileInputRef.current.files = files;
      }

      setImageURL(URL.createObjectURL(photo));
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };
  
  // const handleTakePhoto = async () => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  //     if ('ImageCapture' in window) {
  //       const videoTrack = stream.getVideoTracks()[0];
  //       const imageCapture = new (window as any).ImageCapture(videoTrack);
  //       const photo = await imageCapture.takePhoto();
  
  //       // Set the captured photo to the file input
  //       const file = new File([photo], 'photo.jpg', { type: 'image/jpeg' });
  //       const fileList = new DataTransfer();
  //       fileList.items.add(file);
  
  //       // Use a temporary variable to avoid direct assignment to an optional property
  //       const files = fileList.files;
  //       if (fileInputRef.current) {
  //         fileInputRef.current.files = files;
  //       }
  
  //       setImageURL(URL.createObjectURL(photo));
  //     } else {
  //       console.error('ImageCapture is not supported in this browser.');
  //     }
  //   } catch (error) {
  //     console.error('Error taking photo:', error);
  //   }
  // };
  
  
  

  const fillForm = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files) return;
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);
    formData.append('language', user.language);
    formData.append('operation', 'add');
    try {
      setLoading(true);
      const response = await fetch('http://34.204.63.54/get_imagedets', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      form.reset({
          product_name: result.data.Name || '',
          brand: result.data.Brand || '',
          category: result.data.Category || '',
          quantity: result.data.Quantity ? result.data.Quantity.toString() : '0',
          netweight: result.data.Netweight || '',
          threshold: result.data.Threshold ? result.data.Threshold.toString() : '0',
          price: result.data.Price ? result.data.Price.toString() : '0'
      });
      toast({
        variant: "default",
        title: "Form Filled",
        description: "Form fields have been filled with photo data",
      });
      setLoading(false);
    } catch (error) {
      console.error('Error filling form from photo:', error);
      setLoading(false);
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
        description="Use your camera to take a photo"
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
          {imageURL && (
              <img src={imageURL} alt="Captured" className="w-full" />
            )}
            {/* {imageURL && (
              <img src={imageURL} alt="Captured" className="w-full" />
            )}
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
            /> */}
            {stream && (
              <video
                ref={(video) => {
                  if (video) {
                    video.srcObject = stream;
                    video.play();
                  }
                }}
                className="w-full"
              />
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
            />


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
          {stream && (
              <Button
                type="button"
                onClick={handleCloseCamera}
                disabled={loading}
              >
                Close Camera
              </Button>
            )}
          <Button
              type="button"
              onClick={handleOpenCamera}
              disabled={loading}
            >
              Open Camera
            </Button>
            <Button
              type="button"
              onClick={handleTakePhoto}
              disabled={loading}
            >
              Take Photo
            </Button>
            <Button
              type="button"
              onClick={fillForm}
              disabled={loading}
            >
              Fill Form
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductCameraForm;
