"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Row } from "@tanstack/react-table";
interface AlertModalProps<TData>{
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  row: Row<TData>;
  onDelete: (value: TData) => void;
}

export const AlertModal = <TData,> ({
  isOpen,
  onClose,
  loading,
  onDelete,
  row
}: AlertModalProps<TData>) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const handleDelete = () => {
    // Call the onDelete function with the row data
    onDelete(row.original);
    // Close the modal
    onClose();
  };
  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={handleDelete}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
