// app/api/favorite/status/route.ts
import db from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageId = url.searchParams.get("imageId");
  const userId = parseInt(url.searchParams.get("userId") || "0");

  if (!imageId || !userId) {
    return new Response("Invalid parameters", { status: 400 });
  }

  try {
    // 이미지가 사용자의 즐겨찾기에 있는지 확인
    const existingFavorite = await db.favorite.findUnique({
      where: { userId_imageId: { userId, imageId } },
    });

    return new Response(
      JSON.stringify({
        isFav: existingFavorite !== null,
        favCount: existingFavorite ? 1 : 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Error fetching favorite status", { status: 500 });
  }
}
