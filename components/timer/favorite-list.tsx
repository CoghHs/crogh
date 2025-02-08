import Image from "next/image";
import Link from "next/link";

interface FavoriteListProps {
  imageId: string; // Unsplash의 고유 식별자
  imageUrl: string;
  id: number;
  category: string; // 카테고리 추가
}

export default function FavoriteList({
  imageId,
  imageUrl,
  category,
}: FavoriteListProps) {
  return (
    <Link
      className="flex gap-5 items-center"
      href={`/croquis/${category}/${imageId}`}
    >
      <div className="rounded-md">
        <Image
          className="object-cover size-28 rounded-md"
          width={500}
          height={40}
          src={imageUrl} // 완성된 이미지 URL을 사용
          alt={imageId}
        />
      </div>
    </Link>
  );
}
