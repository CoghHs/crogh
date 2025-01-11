import Image from "next/image";
import Link from "next/link";

interface ListTweetProps {
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
}: ListTweetProps) {
  return (
    <Link
      href={`/tweet/${id}`}
      className={`relative w-full h-72 overflow-hidden rounded-3xl duration-300 ease-in-out shadow-md ${colSpan}`}
    >
      <div className="relative w-full h-full group">
        <Image
          className="object-cover w-full h-full group-hover:opacity-80 transition-opacity duration-300"
          src={`${photo}/home`}
          alt={title}
          fill
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{title}</span>
        </div>
      </div>
    </Link>
  );
}
