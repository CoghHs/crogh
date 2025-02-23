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
      href={`/users/${username}/favorite/${category}/${imageId}`}
    >
      <div className="relative size-28 overflow-hidden rounded-md group">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <Image
          className="object-cover size-28 rounded-md"
          width={500}
          height={40}
          src={imageUrl}
          alt={imageId}
        />
      </div>
    </Link>
  );
}
