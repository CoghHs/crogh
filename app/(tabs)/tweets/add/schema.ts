import { z } from "zod";

export const tweetSchema = z.object({
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

export type TweetType = z.infer<typeof tweetSchema>;