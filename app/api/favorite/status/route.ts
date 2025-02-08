import db from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imageUrl = url.searchParams.get("imageUrl"); // 전체 URL을 받아서 imageId 추출
  const userId = parseInt(url.searchParams.get("userId") || "0");
  const category = url.searchParams.get("category");

  if (!imageUrl || !userId || !category) {
    return new Response("Invalid parameters", { status: 400 });
  }

  try {
    // Unsplash URL에서 고유 imageId 추출
    const imageId = extractImageId(imageUrl);

    console.log("Checking favorite status:", { userId, imageId, category });

    // 이미지가 사용자의 즐겨찾기에 있는지 확인
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_imageId_category: { userId, imageId, category },
      },
    });

    console.log("Existing favorite:", existingFavorite);

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

// 이미지 ID 추출 함수
function extractImageId(unsplashUrl: string): string {
  const parts = unsplashUrl.split("/");
  return parts[parts.length - 1].split("?")[0]; // 고유 이미지 식별자만 반환
}
