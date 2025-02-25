import Image from "next/image";
import Link from "next/link";

interface ListArtworkProps {
  title: string;
  photo: string;
  id: number;
  user?: {
    username: string;
    avator?: string | null;
  };
  colSpan: any;
}

export default function BoardList({
  title,
  photo,
  id,
  colSpan,
}: ListArtworkProps) {
  return (
    <Link
      href={`/artwork/${id}`}
      className={`relative w-full h-72 overflow-hidden rounded-3xl duration-300 ease-in-out shadow-md ${colSpan}`}
    >
      <div className="relative w-full h-full group">
        <Image
          className="object-cover w-full h-full group-hover:opacity-80 transition-opacity duration-300"
          src={`${photo}/home`}
          alt={title}
          width={300}
          height={300}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-extrabold font-serif text-2xl text-shadow">
            {title}
          </span>
        </div>
      </div>
    </Link>
  );
}
