import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import db from "@/lib/db";

export default function FavoriteButton({
  imageId,
  userId,
}: {
  imageId: string;
  userId: number;
}) {
  const [isFavorited, setIsFavorited] = useState(false);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (isFavorited) {
        await db.favorite.deleteMany({
          where: {
            imageId,
            userId,
          },
        });
      } else {
        await db.favorite.create({
          data: {
            imageId,
            userId,
          },
        });
      }
      setIsFavorited(!isFavorited);
    },
  });

  return (
    <button
      onClick={() => favoriteMutation.mutate()}
      className="bg-yellow-500 text-white px-4 py-2 rounded mt-4"
    >
      {isFavorited ? "Unfavorite" : "Favorite"}
    </button>
  );
}
