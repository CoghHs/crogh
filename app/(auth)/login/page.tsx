"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import CustomButton from "@/components/common/CustomButton";
import CustomInput from "@/components/common/CustomInput";
import Image from "next/image";

export default function LogIn() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:block md:w-1/2 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full relative">
            <Image
              src="/images/drawing.png"
              alt="drawing"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-7xl font-serif font-bold">
              CROGH
            </div>
          </div>
        </div>
      </div>

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

          <p className="mt-8 text-center text-neutral-500">
            아직 계정이 없나요?{" "}
            <Link
              href="/create-account"
              className="text-sky-500 hover:text-sky-700 font-medium"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
