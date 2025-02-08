// favorite-button.tsx
"use client";

import { useState, useEffect } from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/solid";
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from "@heroicons/react/24/outline";
interface FavoriteButtonProps {
  imageId: string;
  userId: number;
  category: string;
  imageUrl: string;
}

export default function FavoriteButton({
  imageId,
  userId,
  imageUrl,
  category, // 카테고리 추가
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState<boolean>(false);

  // 페이지 로드 시 즐겨찾기 상태를 확인하는 로직
  useEffect(() => {
    const checkFavorite = async () => {
      const res = await fetch(
        `/api/favorite/status?imageId=${imageId}&userId=${userId}&category=${category}` // 카테고리 추가
      );
      if (res.ok) {
        const data = await res.json();
        setIsFav(data.isFav);
      } else {
        console.error("즐겨찾기 상태 확인 실패");
      }
    };

    checkFavorite();
  }, [imageId, userId, category]); // 카테고리 추가

  const onClick = async () => {
    try {
      const action = isFav ? "DELETE" : "POST";
      const res = await fetch("/api/favorite", {
        method: action,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, userId, category, imageUrl }), // 카테고리 추가
      });

      if (res.ok) {
        setIsFav(!isFav);
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
      className="flex items-center justify-center text-white "
    >
      {isFav ? (
        <HandThumbUpIcon className="size-6" />
      ) : (
        <OutlineHandThumbUpIcon className="size-6" />
      )}
    </button>
  );
}
