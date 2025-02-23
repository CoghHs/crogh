import Image from "next/image";
import Link from "next/link";

interface ListTweetProps {
  photo: string;
  id: number;
  user: {
    username: string;
    avator?: string | null;
  };
}

export default function UserArtworkList({ photo, id }: ListTweetProps) {
  return (
    <Link className="flex items-center justify-center" href={`/tweet/${id}`}>
      <div className="relative size-28 overflow-hidden rounded-md group">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
        <Image
          className="object-cover"
          width={200}
          height={200}
          src={`${photo}/home`}
          alt={photo}
        />
      </div>
    </Link>
  );
}
