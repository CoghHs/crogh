import { getInitialTweets } from "@/app/(tabs)/tweets/page";
import CategoryList from "./category-list";
import Board from "../board";
import { CATEGORY_LIST } from "@/constants";
import React from "react";

export default async function Category() {
  const initialTweets = await getInitialTweets();
  return (
    <div className="flex flex-col mt-5">
      <div className="flex items-center">
        <span className="font-extralight text-8xl font-serif">CATEGORY</span>
        <div className="w-full h-0.5 bg-black" />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {CATEGORY_LIST.map((item, index) => {
          const customClass =
            item.text === "Hand"
              ? "col-span-2"
              : item.text === "Animal"
              ? "col-span-3"
              : "";
          return (
            <React.Fragment key={`${item.query}_${index}`}>
              <div className={customClass}>
                <CategoryList text={item.text} query={item.query} />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center mt-6">
        <div className="w-full h-0.5 bg-black" />
        <span className="font-extralight text-8xl font-serif">BOARD</span>
      </div>
      <div>
        <Board initialTweets={initialTweets} />
      </div>
    </div>
  );
}
