"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthTabBar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 w-full flex items-center justify-between px-10 py-6 z-20 bg-white">
      <Link href="/" className="flex items-center">
        <h1 className="font-serif text-2xl">CROGH</h1>
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/login" className="flex flex-col items-center gap-px">
          {pathname === "/login" ? (
            <span className="px-5 py-2.5 bg-black text-white rounded-3xl">
              로그인
            </span>
          ) : (
            <span className="px-5 py-2.5 rounded-3xl">로그인</span>
          )}
        </Link>
        <Link
          href="/create-account"
          className="flex flex-col items-center gap-px"
        >
          {pathname === "/create-account" ? (
            <span className="px-5 py-2.5 bg-black text-white rounded-3xl">
              회원가입
            </span>
          ) : (
            <span className="px-5 py-2.5 rounded-3xl">회원가입</span>
          )}
        </Link>
      </div>
    </div>
  );
}
