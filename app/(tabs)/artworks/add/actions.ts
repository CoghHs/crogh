"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { artworkSchema } from "./schema";

export async function uploadArtwork(formData: FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    description: formData.get("description"),
  };

  const result = artworkSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  } else {
    const session = await getSession();
    if (session.id) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const countTodayUploads = await db.artwork.count({
        where: {
          userId: session.id,
          created_at: {
            gte: today,
          },
        },
      });

      if (countTodayUploads >= 10) {
        return { error: "하루에 10개 이상의 작품을 업로드할 수 없습니다." };
      }

      const artwork = await db.artwork.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      return { id: artwork.id };
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
