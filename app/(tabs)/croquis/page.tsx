import CategoryBoardLayout from "@/components/category/Category";
import Image from "next/image";

export default function Croquis() {
  return (
    <div className="relative">
      <div className="relative">
        <Image
          width={600}
          height={100}
          src="/images/backphoto.png"
          alt="background"
          className="w-full h-[400px] object-cover rounded-lg"
          quality={100}
          priority
        />
        <span className="absolute top-1/2 left-8 transform -translate-y-1/2 text-white text-lg font-medium max-w-xl text-shadow">
          <span className="text-3xl font-bold">Unsplash </span>
          에서 제공하는 다양한 이미지를 활용해,
          <br />
          집중력을 높일 수 있는 타이머와 함께 크로키를 즐길 수 있는
          사이트입니다.
        </span>
      </div>
      <CategoryBoardLayout />
    </div>
  );
}
