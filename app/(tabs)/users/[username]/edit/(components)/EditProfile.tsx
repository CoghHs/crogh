"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "@/components/common/CustomInput";
import CustomButton from "@/components/common/CustomButton";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { profileSchema } from "../schema";
import { getUserProfile, updateUserProfile } from "../actions";

type ProfileFormValues = z.infer<typeof profileSchema>;

const EditProfile = ({ params }: { params: { username: string } }) => {
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = await getUserProfile(params.username);
      if (user) {
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("bio", user.bio || "");
        setPreview(user.avatar || "");
      }
    };

    fetchUserProfile();
  }, [params.username, setValue]);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFile(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("bio", data.bio || "");
    formData.append("password", data.password || "");

    if (file) {
      formData.append("avatar", file);
    }

    await updateUserProfile(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-5"
      >
        <label
          htmlFor="avatar"
          className="border-2 aspect-square flex justify-center items-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {!preview ? (
            <>
              <PhotoIcon className="w-20 h-20 text-neutral-400" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {errors.avatar?.message}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="avatar"
          name="avatar"
          className="hidden"
          accept="image/*"
        />
        <CustomInput
          {...register("username")}
          required
          placeholder="Username"
          type="text"
          errors={[errors.username?.message ?? ""]}
        />
        <CustomInput
          {...register("email")}
          required
          placeholder="Email"
          type="email"
          errors={[errors.email?.message ?? ""]}
        />
        <CustomInput
          {...register("bio")}
          placeholder="Bio"
          type="text"
          errors={[errors.bio?.message ?? ""]}
        />
        <CustomInput
          {...register("password")}
          type="password"
          placeholder="New Password"
          errors={[errors.password?.message ?? ""]}
        />
        <CustomButton text="Update Profile" />
      </form>
    </div>
  );
};

export default EditProfile;
