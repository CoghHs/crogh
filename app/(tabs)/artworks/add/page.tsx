"use client";

import CustomButton from "@/components/common/CustomButton";
import CustomInput from "@/components/common/CustomInput";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { getUploadUrl, uploadArtwork } from "./actions";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { artworkSchema, ArtworkType } from "./schema";
import { useRouter } from "next/navigation";

const fileSchema = z.object({
  type: z.string().refine((value) => value.includes("image"), {
    message: "이미지 파일만 업로드 가능합니다.",
  }),
  size: z.number().max(1024 * 1024 * 2, {
    message: "이미지 파일은 2MB 이하로 업로드 가능합니다.",
  }),
});

export default function AddArtwork() {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ArtworkType>({
    resolver: zodResolver(artworkSchema),
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files || files.length === 0) {
      setPreview(null);
      return;
    }
    const file = files[0];
    const results = fileSchema.safeParse(file);
    if (!results.success) {
      alert(
        results.error.flatten().fieldErrors.type ||
          results.error.flatten().fieldErrors.size
      );
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/2D7iuynfofPUs7N3pYD8rA/${id}`
      );
    }
  };

  const onSubmit = async (data: ArtworkType) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("photo", data.photo);

    const artwork = await uploadArtwork(formData);

    if (artwork?.error) {
      alert(artwork.error);
      return;
    }

    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      alert("파일 업로드에 실패했습니다.");
      return;
    }

    alert("업로드가 성공적으로 완료되었습니다.");
    router.push(`/artwork/${artwork?.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <label
          htmlFor="photo"
          className={`relative border-2 border-dashed border-neutral-300 rounded-md cursor-pointer overflow-hidden aspect-square bg-gray-100 flex justify-center items-center ${
            preview ? "bg-cover bg-center" : ""
          }`}
          style={{
            backgroundImage: preview ? `url(${preview})` : undefined,
          }}
        >
          {!preview ? (
            <>
              <PhotoIcon className="w-20 h-20 text-neutral-400" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
            </>
          ) : null}
          <input
            type="file"
            id="photo"
            name="photo"
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept="image/*"
            onChange={onImageChange}
          />
        </label>

        <CustomInput
          {...register("title")}
          required
          placeholder="제목"
          type="text"
          errors={[errors.title?.message ?? ""]}
        />

        <CustomInput
          {...register("description")}
          required
          placeholder="자세한 설명"
          type="text"
          errors={[errors.description?.message ?? ""]}
        />

        <CustomButton text="작성 완료" />
      </form>
    </div>
  );
}
