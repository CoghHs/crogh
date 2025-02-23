"use client";

import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
import { useOptimistic, startTransition } from "react";
import { dislikePost, likePost } from "@/app/(tabs)/tweet/[id]/actions";

interface LikeButtonProps {
  isLiked: boolean;
  likeCount: number;
  tweetId: number;
}

export default function LikeButton({
  isLiked,
  likeCount,
  tweetId,
}: LikeButtonProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (previousState) => ({
      isLiked: !previousState.isLiked,
      likeCount: previousState.isLiked
        ? previousState.likeCount - 1
        : previousState.likeCount + 1,
    })
  );

  const onClick = async () => {
    startTransition(() => {
      reducerFn(null);
    });
    try {
      if (state.isLiked) {
        await dislikePost(tweetId); // 서버 액션 직접 호출
      } else {
        await likePost(tweetId); // 서버 액션 직접 호출
      }
    } catch (error) {
      console.error("Failed to update like status", error);
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-lg rounded-lg transition-colors duration-300 ease-in-out transform ${
        state.isLiked
          ? "text-sky-500"
          : "text-neutral-400 hover:text-neutral-600"
      } p-2`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="w-6 h-6" />
      ) : (
        <OutlineHandThumbUpIcon className="w-6 h-6" />
      )}
      <span className={`ml-1 ${state.likeCount > 100 ? "font-bold" : ""}`}>
        {state.likeCount}
      </span>
    </button>
  );
}
