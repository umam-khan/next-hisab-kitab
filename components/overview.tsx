"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { getProducts } from "@/app/api/db/apis";
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
const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export function Overview() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    async function fetchProducts() {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('No user data found in local storage');
        return;
      }

      let user;
      try {
        user = JSON.parse(userString);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return;
      }

      if (!user || !user.user_id) {
        console.error('User object is missing or does not have user_id');
        return;
      }

      const userId = user.user_id;
      const result:any = await getProducts(userId);
      console.log("Fetched products:", result);
      if(result.success) {
        setProducts(result.products);
      } else {
        console.error("Error fetching products");
      }
    }

    fetchProducts();
  }, []);
  return (
    <ResponsiveContainer width="100%" height={350}>
    <BarChart data={products}>
      <XAxis
        dataKey="product_name"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
      />
      <YAxis
        dataKey="quantity"
        stroke="#888888"
        fontSize={12}
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `${value}`}
      />
      <Bar dataKey="quantity" fill="#adfa1d" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
   
  );
}
 // <ResponsiveContainer width="100%" height={350}>
    //   <BarChart data={data}>
    //     <XAxis
    //       dataKey="name"
    //       stroke="#888888"
    //       fontSize={12}
    //       tickLine={false}
    //       axisLine={false}
    //     />
    //     <YAxis
    //       stroke="#888888"
    //       fontSize={12}
    //       tickLine={false}
    //       axisLine={false}
    //       tickFormatter={(value) => `Rs${value}`}
    //     />
    //     <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
    //   </BarChart>
    // </ResponsiveContainer>
