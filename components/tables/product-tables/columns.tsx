"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
const onDelete = () => {
  alert("deleted");
}
const onEdit = () => {
  alert("edited");
}
export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "product_name",
    header: "NAME",
  },

  {
    accessorKey: "brand",
    header: "BRAND",
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
  },
  {
    accessorKey: "netweight",
    header: "NET WEIGHT",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },
  {
    accessorKey: "threshold",
    header: "THRESHOLD",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction row={row} onEdit={onEdit} onDelete={onDelete} data={row.original} />,
  },
];