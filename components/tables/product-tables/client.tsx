"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import MyDialog from "@/components/dashboard/myDialog";

// interface ProductsClientProps {
//   data: User[];
// }

export const ProductClient:any = ({ data,  handleDelete }: any) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage your products"
        />
        {/* <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/product/createaudio`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
        <MyDialog />
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
    </>
  );
};
