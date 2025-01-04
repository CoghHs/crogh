import Image from "next/image";
import Link from "next/link";

interface FavoriteListProps {
  imageId: string;
  id: number;
}

export default function UserFavoriteList({ imageId, id }: FavoriteListProps) {
  return (
    <Link className="flex gap-5 items-center" href={`/tweet/${id}`}>
      <div className=" rounded-md">
        <Image
          className="object-cover size-28 rounded-md"
          width={40}
          height={40}
          src={imageId}
          alt={imageId}
        />
      </div>
    </Link>
  );
}
