import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function addFavorite(imageId: string, userId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.favorite.create({
      data: {
        imageId,
        userId: session.id!,
      },
    });
    revalidateTag(`favorite-status-${imageId}`);
  } catch (e) {
    console.log(e);
  }
}

export async function removeFavorite(imageId: string, userId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.favorite.deleteMany({
      where: {
        imageId,
        userId: session.id!,
      },
    });
    revalidateTag(`favorite-status-${imageId}`);
  } catch (e) {
    console.log(e);
  }
}

export const getFavoriteStatus = async (userId: number, imageId: string) => {
  const favorite = await db.favorite.findUnique({
    where: { userId_imageId: { userId, imageId } },
  });
  return favorite !== null;
};
