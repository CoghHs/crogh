import Image from "next/image";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 메인 콘텐츠 */}
      <div className="flex flex-col md:flex-row h-screen">
        {/* 왼쪽 텍스트 영역 */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="max-w-md">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
              당신의 예술을
              <span className="relative">
                공유
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-blue-400"></span>
              </span>
              하세요
            </h1>
            <p className="text-neutral-600 text-lg mb-8">
              CROGH에서 크로키 연습을 하고, 작품을 공유하며, 다른 아티스트들과
              소통하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create-account"
                className="bg-black text-white px-6 py-3 rounded-lg text-center hover:bg-neutral-800 transition-colors"
              >
                무료로 시작하기
              </Link>
              <Link
                href="/gallery"
                className="border border-neutral-300 px-6 py-3 rounded-lg text-center hover:bg-neutral-100 transition-colors"
              >
                갤러리 둘러보기
              </Link>
            </div>
          </div>
        </div>

        {/* 오른쪽 이미지/아트워크 영역 */}
        <div className="w-full md:w-1/2 bg-neutral-100 relative overflow-hidden">
          <Image src="/images/cogh.png" alt="cogh" width={500} height={500} />
        </div>
      </div>

      {/* 하단 특징 섹션 */}
      <div className="bg-white py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            CROGH에서 경험하세요
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">크로키 타이머</h3>
              <p className="text-neutral-600">
                다양한 타이머 설정으로 효과적인 드로잉 연습을 진행하세요.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">작품 갤러리</h3>
              <p className="text-neutral-600">
                당신의 작품을 공유하고 다른 아티스트들의 작업을 탐색하세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
