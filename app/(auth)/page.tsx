import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="py-24 md:min-h-screen md:py-0 ">
      <div className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-1/2 flex items-center justify-center p-10 ">
          <div className="max-w-md ">
            <h1 className="font-serif text-3xl md:text-5xl font-semibold mb-4">
              <span className="text-black">
                CROGH와 함께<p className="mt-4 ml-8">그림을 그려보세요</p>
              </span>
            </h1>
            <p className="text-neutral-600 mb-4">
              최적화된 크로키 타이머로 연습하고, 엄선된 레퍼런스 자료를
              활용하며, 당신만의 작품을 세상과 공유하세요.
            </p>
            <div className="flex">
              <Link
                href="/create-account"
                className="bg-black text-white px-6 py-3 rounded-lg text-center hover:bg-neutral-800 transition-colors font-medium"
              >
                무료로 시작하기
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full h-full md:w-1/2 relative overflow-hidden">
          <Image
            src="/images/gogh.png"
            alt="cogh"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
