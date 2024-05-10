import BreadCrumb from "@/components/breadcrumb";
import ProductAudioForm from "@/components/forms/create-audio-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function Page() {
  const breadcrumbItems = [
    { title: "Product", link: "/dashboard/product" },
    { title: "Create-Audio", link: "/dashboard/product/createaudio" },
  ];
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <ProductAudioForm
          categories={[
            { _id: "shirts", name: "shirts" },
            { _id: "pants", name: "pants" },
          ]}
          initialData={null}
          key={null}
        />
      </div>
    </ScrollArea>
  );
}
