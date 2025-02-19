import db from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageId = url.searchParams.get("imageId"); // imageId를 URL에서 바로 추출
  const userId = parseInt(url.searchParams.get("userId") || "0");
  const category = url.searchParams.get("category");

  if (!imageId || !userId || !category) {
    return new Response("Invalid parameters", { status: 400 });
  }

  try {
    // 이미지가 사용자의 즐겨찾기에 있는지 확인
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_imageId_category: { userId, imageId, category },
      },
    });

    return new Response(
      JSON.stringify({
        isFav: existingFavorite !== null,
        favCount: existingFavorite ? 1 : 0,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching favorite status:", error);
    return new Response("Error fetching favorite status", { status: 500 });
  }
}
