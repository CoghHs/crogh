"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 왼쪽 이미지/아트 섹션 */}
      <div className="hidden md:block md:w-1/2 bg-neutral-100 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="relative w-full h-full max-w-lg">
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-7xl font-serif font-bold">
                  CROGH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 회원가입 폼 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <Link
              href="/"
              className="font-serif text-2xl font-bold mb-6 inline-block"
            >
              CROGH
            </Link>
            <h1 className="text-3xl font-bold mb-2">회원가입</h1>
            <p className="text-neutral-600">
              계정을 만들고 창작 커뮤니티에 참여하세요.
            </p>
          </div>

          <form action={dispatch} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
              <CustomInput
                name="username"
                type="text"
                placeholder="Username"
                required
                errors={state?.fieldErrors.username}
              />
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
              <CustomInput
                name="confirm_password"
                type="password"
                placeholder="Confirm Password"
                required
                minLength={PASSWORD_MIN_LENGTH}
                errors={state?.fieldErrors.confirm_password}
              />
              <CustomButton text="회원가입" />
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-500">또는</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-neutral-600">
            이미 계정이 있나요?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
