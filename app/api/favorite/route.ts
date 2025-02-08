// api/favorite/route.ts
import db from "@/lib/db";
export async function POST(req: Request) {
  const { imageId, userId, category, imageUrl } = await req.json();

  try {
    // 이미지가 이미 즐겨찾기에 존재하는지 확인
    const existingFavorite = await db.favorite.findUnique({
      where: { userId_imageId_category: { userId, imageId, category } },
    });

    if (existingFavorite) {
      return new Response("이미 즐겨찾기에 추가되었습니다.", { status: 400 });
    }

    // 즐겨찾기 추가
    await db.favorite.create({
      data: { imageId, userId, category, imageUrl }, // imageUrl 저장
    });

    return new Response("즐겨찾기에 추가되었습니다.");
  } catch (error) {
    console.error(error); // 에러 로그 추가
    return new Response("즐겨찾기 추가 오류", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { imageId, userId, category } = await req.json();

  try {
    const favorite = await db.favorite.findUnique({
      where: { userId_imageId_category: { userId, imageId, category } },
    });

    if (!favorite) {
      return new Response("즐겨찾기가 존재하지 않습니다.", { status: 400 });
    }

    // 즐겨찾기 삭제
    await db.favorite.delete({
      where: { userId_imageId_category: { userId, imageId, category } },
    });

    return new Response("즐겨찾기에서 삭제되었습니다.");
  } catch (error) {
    return new Response("즐겨찾기 삭제 오류", { status: 500 });
  }
}
