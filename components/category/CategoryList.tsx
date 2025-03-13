import { fetchPoses } from "@/api/croquies";
import Image from "next/image";
import Link from "next/link";

interface CategoryListProps {
  query: string;
  text: string;
}

export default async function CategoryList({ query, text }: CategoryListProps) {
  const data = await fetchPoses(query);
  const pose = data.results[0];
  const dynamicLink = `/croquis/${query}/${pose.id}`;

  return (
    <div className="flex flex-col items-center">
      <Link href={dynamicLink} className="relative w-full">
        <div className="relative w-full h-80 group">
          <Image
            width={500}
            height={100}
            className="w-full h-full object-cover rounded-lg"
            src={`${pose.urls.raw}?w=1980&h=1024&q=85`}
            alt={pose.alt_description}
          />
          <div className="absolute inset-0 bg-black opacity-60 group-hover:opacity-0 transition-opacity duration-200 rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-extrabold text-2xl font-serif text-shadow">
              {text}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
