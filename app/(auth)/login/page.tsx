"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import CustomButton from "@/components/common/CustomButton";
import CustomInput from "@/components/common/CustomInput";

export default function LogIn() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 이미지/아트 섹션 */}
      <div className="hidden md:block md:w-1/2 bg-neutral-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3/4 h-3/4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl transform -rotate-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-7xl font-serif font-bold">
              CROGH
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link
              href="/"
              className="font-serif text-2xl font-bold mb-6 inline-block"
            >
              CROGH
            </Link>
            <h1 className="text-3xl font-bold mb-2">로그인</h1>
            <p className="text-neutral-600">
              계정에 로그인하여 창작을 이어가세요.
            </p>
          </div>

          <form action={dispatch} className="space-y-6">
            <CustomInput
              name="email"
              type="email"
              placeholder="Email"
              required
              errors={state?.fieldErrors.email}
            />
            <CustomInput
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              errors={state?.fieldErrors.password}
            />
            <CustomButton text="로그인" />
          </form>

          <p className="mt-8 text-center text-neutral-600">
            아직 계정이 없나요?{" "}
            <Link
              href="/create-account"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
