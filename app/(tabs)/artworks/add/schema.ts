import { z } from "zod";

export const artworkSchema = z.object({
  photo: z.string({
    required_error: "사진은 필수입니다.",
  }),
  title: z.string({
    required_error: "제목은 필수입니다.",
  }),
  description: z.string({
    required_error: "설명은 필수입니다.",
  }),
});

export type ArtworkType = z.infer<typeof artworkSchema>;
