import ClientFavoriteDetail from "@/components/client-favorite";
import FavoriteList from "@/components/timer/favorite-list";
import db from "@/lib/db";
import { notFound } from "next/navigation";

interface FavoriteDetailProps {
  params: {
    username: string;
    category: string;
    imageId: string;
  };
}

export default async function FavoriteDetail({
  params: { username, category, imageId },
}: FavoriteDetailProps) {
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
    include: { Favorite: true },
  });

  if (!user) {
    notFound();
  }

  const favoriteImage = await db.favorite.findMany({
    where: {
      userId: user.id,
      imageId: imageId,
      category: category,
    },
    take: 1,
  });

  if (favoriteImage.length === 0) {
    notFound();
  }

  const image = favoriteImage[0];

  return (
    <div>
      <ClientFavoriteDetail user={user} image={image} />

      <div>
        <div className="flex items-center">
          <span className="font-extralight text-8xl font-serif">FAVORITE</span>
          <div className="w-full h-0.5 bg-black" />
        </div>
        <div className="flex gap-4">
          {user?.Favorite?.map((fav: any) => {
            return (
              <FavoriteList
                username={user.username}
                key={fav.id}
                imageId={fav.imageId}
                imageUrl={fav.imageUrl}
                category={fav.category}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
