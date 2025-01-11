"use client";

import { useState } from "react";
import BoardList from "./board-list";
import { InitialTweets } from "@/app/(tabs)/tweets/page";

interface TweetListProps {
  initialTweets: InitialTweets;
}

export default function Board({ initialTweets }: TweetListProps) {
  const [tweets, setTweets] = useState(initialTweets.slice(0, 7));

  return (
    <div className="p-5 grid grid-cols-6 gap-4">
      {tweets.map((tweet, index) => {
        const colSpanClass =
          index === 0
            ? "col-span-2" // 첫 번째 트윗은 4열 차지
            : index % 3 === 0
            ? "col-span-1" // 3번째마다 3열 차지
            : "col-span-2"; // 나머지는 2열 차지
        return <BoardList key={tweet.id} {...tweet} colSpan={colSpanClass} />;
      })}
    </div>
  );
}
