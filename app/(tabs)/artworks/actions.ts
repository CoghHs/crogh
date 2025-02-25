"use server";

import db from "@/lib/db";

export async function getMoreArtworks(page: number) {
  const artwork = await db.artwork.findMany({
    select: {
      title: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * 1,
    take: 1,
    orderBy: {
      created_at: "asc",
    },
  });
  return artwork;
}
