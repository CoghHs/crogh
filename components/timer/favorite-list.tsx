import Image from "next/image";
import Link from "next/link";

interface FavoriteListProps {
  imageId: string; // Unsplash의 고유 식별자
  imageUrl: string;
  category: string; // 카테고리 추가
  username: string;
}

export default function FavoriteList({
  imageId,
  imageUrl,
  category,
  username,
}: FavoriteListProps) {
  return (
    <Link
      className="flex gap-5 items-center"
      href={`/users/${username}/favorite/${category}/${imageId}`} // 이미지 고유 ID로 링크
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
