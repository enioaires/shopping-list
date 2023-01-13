import { ShoppingItem } from "@prisma/client";
import React, { Dispatch, SetStateAction } from "react";
import { trpc } from "../utils/trpc";

interface DeleteItemModalProps {
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
  id: string;
}

const DeleteItemModal: React.FC<DeleteItemModalProps> = ({
  setIsDeleteModalOpen,
  setItems,
  id,
}) => {
  const { mutate: deleteItem } = trpc.useMutation(["items.deleteItem"], {
    onSuccess: (shoppingItem: ShoppingItem) => {
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== shoppingItem.id)
      );
    },
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 ">
      <div className="w-1/6 space-y-4 rounded-md bg-gray-600 p-5">
        <h3 className="text-xl font-medium">Are you sure?</h3>

        <div className="grid grid-cols-2 gap-6">
          <button
            type="button"
            className="rounded bg-red-500 p-1 text-white transition hover:bg-red-600"
            onClick={() => {
              setIsDeleteModalOpen(false);
              deleteItem({ id });
            }}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDeleteModalOpen(false);
            }}
            className="rounded bg-violet-500 p-1 text-white transition hover:bg-violet-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteItemModal;
