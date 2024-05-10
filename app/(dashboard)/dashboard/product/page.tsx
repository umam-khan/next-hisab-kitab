'use client'
import { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadcrumb";
import { ProductClient } from "@/components/tables/product-tables/client";
// import { users } from "@/constants/data";
import { getProducts } from "@/app/api/db/apis";

const breadcrumbItems = [{ title: "Product", link: "/dashboard/product" }];
export default function page() {
  const [products,setProducts]=useState([]);
  useEffect(() => {
    getProductsFromSupabase()
  }, [])

  const getProductsFromSupabase = async () => {
    // const res: any = await checkUserAuthClient()
    // if (res.error !== null) {
    //   router.push('/')
    //   return
    // }
    // if (res.data.session === null) {
    //   setSkeletonShow(false)
    //   setSessionNotFound(true)
    //   return
    // }
    // const metadata = res.data.session.user.user_metadata
    const result: any = await getProducts();
    console.log("Fetched products:", result);
    if (result.success === true) {
        setProducts(result.products || []);
        console.log("Setting products:", result.products);
    } else {
        // handle error or setProducts to an empty array as a fallback
        console.log("Failed to fetch products, setting empty array.");
        setProducts([]);
    }
    
    // } else {
    //   toast({
    //     variant: "destructive",
    //     title: "SERVER ERROR",
    //     description: "Please Try again !",
    //   });
    // }
    // setUserData({ id: res.data.session.user.id, ...metadata })
    // setSkeletonShow(false)
  }
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <ProductClient data={products} />
      </div>
    </>
  );
}
