"use server";

import db from "@/lib/db";

export async function getSearchResults(keyword: string) {
  const results = await db.artwork.findMany({
    where: {
      OR: [
        { title: { contains: keyword } },
        { description: { contains: keyword } },
        { user: { username: { contains: keyword } } },
      ],
    },
    select: {
      id: true,
      created_at: true,
      title: true,
      photo: true,
      description: true,
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
  return results;
}
