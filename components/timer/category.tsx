import { getInitialTweets } from "@/app/(tabs)/tweets/page";
import CategoryList from "./category-list";
import Board from "../board";

export default async function Category() {
  const initialTweets = await getInitialTweets();
  return (
    <div className="flex flex-col mt-5">
      <div className="flex items-center">
        <span className="font-extralight text-8xl font-serif">CATEGORY</span>
        <div className="w-full h-0.5 bg-black" />
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="col-span-2">
          <CategoryList text="Hand" query="hand" />
        </div>
        <CategoryList text="Pose" query="pose" />
        <CategoryList text="Face" query="face" />
        <CategoryList text="Toe" query="toe" />
        <div className="col-span-3">
          <CategoryList text="Animal" query="animal" />
        </div>
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
