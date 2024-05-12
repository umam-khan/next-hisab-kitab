'use client'
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { ProductClient } from "@/components/tables/product-tables/client";
// import { users } from "@/constants/data";
import { getProducts, deleteProduct } from "@/app/api/db/apis";
interface Product {
  product_name: string;
  brand: string;
  category: string;
  quantity: number; // Using number type for integers in TypeScript
  netweight: string; // Assuming netweight is a string, specify number if it's numerical
  threshold: number;
  price: number; // Using number type for floats in TypeScript
  user_id: string; // UUID is a string
  created_at: string; // Date as string; you could also use Date type if working with Date objects
}

const breadcrumbItems = [{ title: "Product", link: "/dashboard/product" }];
export default function page() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const { user_id } = JSON.parse(userString);
        getProductsFromSupabase(user_id);
    } else {
        // Handle the case where there is no user in local storage
        console.log("No user found in local storage.");
        setProducts([]);
    }
}, []);

const getProductsFromSupabase = async (userId : any) => {
    const result = await getProducts(userId);
    console.log("Fetched products:", result);
    if (result.success) {
        setProducts(result.products || []);
        console.log("Setting products:", result.products);
    } else {
        console.log("Failed to fetch products, setting empty array.");
        setProducts([]);
    }
};

const handleDelete = async (productId : any)  => {
    const response = await deleteProduct(productId);
    if (response.success) {
        console.log('Product deleted successfully');
        // Optionally refresh the list or remove the item from the state
    } else {
        console.error('Failed to delete the product:', response.error);
        // Display an error message to the user
    }
}
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProductClient data={products} onDelete={handleDelete} />
      </div>
    </>
  );
}
