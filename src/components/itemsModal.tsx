import { ShoppingItem } from "@prisma/client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { trpc } from "../utils/trpc";

interface ItemModalProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<ShoppingItem[]>>;
}

const ItemModal: React.FC<ItemModalProps> = ({ setIsModalOpen, setItems }) => {
  const [newItem, setNewItem] = useState<string>("");

  const { mutate: addItem } = trpc.useMutation(["items.addItem"], {
    onSuccess: (item) => {
      setItems((prevItems) => [...prevItems, item]);
    },
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 ">
      <div className="w-1/6 space-y-4 rounded-md bg-gray-600 p-5">
        <h3 className="text-xl font-medium">Name</h3>
        <input
          type="text"
          autoComplete="off"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="w-full rounded-md border border-white bg-black px-2 shadow-sm focus:border-violet-300 focus:ring focus:ring-violet-200 focus:ring-opacity-50"
        />
        <div className="grid grid-cols-2 gap-6">
          <button
            type="button"
            className="rounded bg-gray-500 p-1 text-white transition hover:bg-gray-600"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              addItem({ name: newItem });
              setIsModalOpen(false);
            }}
            className="rounded bg-violet-500 p-1 text-white transition hover:bg-violet-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;
