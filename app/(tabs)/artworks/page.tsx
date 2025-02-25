import ArtworkList from "@/components/artwork/ArtworkList";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache } from "next/cache";

// const getCachedProducts = nextCache(getInitialTweets, ["home-products"]);

export async function getInitialArtworks() {
  const artworks = await db.artwork.findMany({
    select: {
      title: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  return artworks;
}

export type InitialArtworks = Prisma.PromiseReturnType<
  typeof getInitialArtworks
>;

export const metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function Artworks() {
  const initialArtworks = await getInitialArtworks();

  return (
    <div>
      <ArtworkList initialArtworks={initialArtworks} />
    </div>
  );
}
