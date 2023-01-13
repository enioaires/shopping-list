import { ShoppingItem } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ItemModal from "../components/itemsModal";
import { trpc } from "../utils/trpc";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import DeleteItemModal from "../components/deleteItemModal";

const Home: NextPage = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [checkedItems, setCheckedItems] = useState<ShoppingItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string>("");

  const { data: itemsData, isLoading: isLoadingGet } = trpc.useQuery(
    ["items.getAllItems"],
    {
      onSuccess: (shoppingItems) => {
        setItems(shoppingItems);
        const checked = shoppingItems.filter((item) => item.checked);
        setCheckedItems(checked);
      },
    }
  );

  const { mutate: toggleChecked } = trpc.useMutation(["items.toggleChecked"], {
    onSuccess: (shoppingItem: ShoppingItem) => {
      // If the item is already checked, remove it from the checkedItems array
      if (checkedItems.some((item) => item.id === shoppingItem.id)) {
        // Remove the item from the checkedItems array
        setCheckedItems((prevItems) =>
          prevItems.filter((item) => item.id !== shoppingItem.id)
        );
      } else {
        // If the item is not checked, add it to the checkedItems array
        setCheckedItems((prevItems) => [...prevItems, shoppingItem]);
      }
    },
  });

  if (!itemsData || isLoadingGet) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>Shopping List T3</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isModalOpen && (
        <ItemModal setIsModalOpen={setIsModalOpen} setItems={setItems} />
      )}

      {isDeleteModalOpen && (
        <DeleteItemModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          setItems={setItems}
          id={idToDelete}
        />
      )}

      <main className="mx-auto my-12 max-w-3xl">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold">Shopping List T3</h2>
          <button
            type="button"
            className="rounded bg-violet-500 p-3 text-white transition hover:bg-violet-600"
            onClick={() => setIsModalOpen(true)}
          >
            Add new
          </button>
        </div>
        <ul className="mt-8">
          {items.map((item) => {
            const { id, name } = item;
            return (
              <li key={id} className="flex items-center justify-between py-1">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 flex origin-left items-center justify-center">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: checkedItems.some((item) => item.id === id)
                          ? "100%"
                          : "0%",
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="h-[2px] w-full translate-y-px bg-red-500"
                    />
                  </div>
                  <span
                    onClick={() =>
                      toggleChecked({
                        id,
                        checked: checkedItems.some((item) => item.id === id)
                          ? false
                          : true,
                      })
                    }
                    className="text-md font-semibold"
                  >
                    {name}
                  </span>
                </div>
                <HiX
                  className="cursor-pointer text-xl text-red-500"
                  onClick={() => {
                    setIdToDelete(id);
                    setIsDeleteModalOpen(true);
                  }}
                />
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Home;