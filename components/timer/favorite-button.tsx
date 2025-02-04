"use client";

import { useState, useEffect } from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";

interface FavoriteButtonProps {
  imageId: string;
  userId: number;
}

export default function FavoriteButton({
  imageId,
  userId,
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState<boolean>(false);
  const [favCount, setFavCount] = useState<number>(0);

  // 페이지 로드 시 즐겨찾기 상태를 확인하는 로직
  useEffect(() => {
    const checkFavorite = async () => {
      const res = await fetch(
        `/api/favorite/status?imageId=${imageId}&userId=${userId}`
      );
      if (res.ok) {
        const data = await res.json();
        setIsFav(data.isFav);
        setFavCount(data.favCount);
      } else {
        console.error("즐겨찾기 상태 확인 실패");
      }
    };

    checkFavorite();
  }, [imageId, userId]);

  const onClick = async () => {
    try {
      const action = isFav ? "DELETE" : "POST";
      const res = await fetch("/api/favorite", {
        method: action,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, userId }),
      });

      if (res.ok) {
        setIsFav(!isFav);
        setFavCount(isFav ? favCount - 1 : favCount + 1);
      } else {
        console.error("즐겨찾기 오류");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center text-neutral-500 text-sm rounded-full p-2"
    >
      {isFav ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      <span>{isFav}</span>
    </button>
  );
}
