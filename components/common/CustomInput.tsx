import React, { InputHTMLAttributes, ForwardedRef } from "react";

interface CustomInputProps {
  name: string;
  errors?: string[];
}

function CustomInput(
  {
    name,
    errors = [],
    ...rest
  }: CustomInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={ref}
        name={name}
        className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-2 transition ring-neutral-200 focus:ring-sky-400  border-none placeholder:text-neutral-400"
        {...rest}
      />
      {errors.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}

// forwardRef 없이 바로 export default function으로 반환ㅌ
export default React.forwardRef(CustomInput);
