"use client";
import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";

import { createProduct } from "@/app/api/db/apis";
// import FileUpload from "@/components/FileUpload";
import { useToast } from "../ui/use-toast";
import FileUpload from "../file-upload";
const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
});
export const IMG_MAX_LIMIT = 3;
const formSchema = z.object({
  Name: z
    .string(),
    // .min(3, { message: "Product Name must be at least 3 characters" }),
  Brand: z
    .string(),
    // .min(3, { message: "Product Brand must be at least 3 characters" }),
  Price: z
    .string(),
    // .min(1, { message: "Product Price must be at least 1 character" }),
  Category: z
    .string(),
    // .min(3, { message: "Product Category must be at least 3 characters" }),
  // imgUrl: z
  //   .array(ImgSchema)
  //   .max(IMG_MAX_LIMIT, { message: "You can only add up to 3 images" })
  //   .min(1, { message: "At least one image must be added." }),
  Quantity: z
    .string(),
    // .min(3, { message: "Product Quantity must be at least 3 characters" }),
  Threshold: z
    .string(),
    // .min(1, { message: "Product Quantity must be at least 1 characters" }),
  NetWeight: z
    .string(),
    // .min(1, { message: "Product Quantity must be at least 1 characters" }),
  // ProductId: z.coerce.number(),
  // category: z.string().min(1, { message: "Please select a category" }),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product." : "Add a new product";
  const toastMessage = initialData ? "Product updated." : "Product created.";
  const action = initialData ? "Save changes" : "Create";

  //form states
  const [Name, setName] = useState<string>("")
  const [Brand, setBrand] = useState<string>("")
  const [Quantity, setQuantity] = useState<string>("")
  const [Net_Weight, setNet_Weight] = useState<string>("")
  const [Price, setPrice] = useState<string>("")
  const [Category, setCategory] = useState<string>("")
  const [Threshold, setThreshold] = useState<string>("")

  const defaultValues = initialData
    ? initialData
    : {
        Name: "",
        Brand: "",
        Category: "",
        Quantity: "",
        NetWeight: "",
        Threshold: "",
        Price: "",
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    try {
      setLoading(true);
      const formdata = {
        'brand': Brand,
        'quantity': Number(Quantity),
        'netweight': Net_Weight,
        'category': Category,
        'price':Number(Price),
        'product_name': Name,
        'threshold' : Number(Threshold),
        'Language' : user.language,
        'user_id' : user.user_id
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

  const onDelete = async () => {
    try {
      setLoading(true);
      //   await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  // const triggerImgUrlValidation = () => form.trigger("imgUrl");

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* FILE/IMAGE UPLOAD COMPONENT 
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <FileUpload
                    onChange={field.onChange}
                    value={field.value}
                    onRemove={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="Name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                      value={Name}
                      onChange={(e) => {
                        setName(e.target.value)
                    }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Brand"
                      {...field}
                      value={Brand}
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
              name="Category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category"
                      {...field}
                      value={Category} 
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
              name="Quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Quantity"
                      {...field}
                      value={Quantity} 
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
              name="NetWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Weight</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Net Weight"
                      {...field}
                      value={Net_Weight}
                      onChange={(e) => {
                        setNet_Weight(e.target.value)
                    }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Threshold"
                      {...field}
                      value={Threshold}
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
              name="Price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Price"
                      {...field}
                      value={Price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                    }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
