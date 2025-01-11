import { fetchPoses } from "@/lib/constants";
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
            width={600}
            height={100}
            className="w-full h-full object-cover rounded-lg group-hover:opacity-80  transition-all  duration-300"
            src={pose.urls.full}
            alt={pose.alt_description}
          />
          <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
            <span className="text-white rounded-full font-extrabold text-2xl font-serif flex px-6">
              {text}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
