"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(artworkId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.like.create({
      data: {
        artworkId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${artworkId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function dislikePost(artworkId: number) {
  try {
    const session = await getSession();
    if (!session?.id) throw new Error("Unauthorized");

    await db.like.delete({
      where: {
        id: {
          artworkId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${artworkId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function addComment(formData: FormData) {
  const data = {
    newComment: formData.get("newComment"),
  };
}
