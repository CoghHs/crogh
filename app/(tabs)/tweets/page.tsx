import TweetList from "@/components/tweet-list";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";

const getCachedProducts = nextCache(getInitialTweets, ["home-products"]);

export async function getInitialTweets() {
  const tweets = await db.tweet.findMany({
    select: {
      title: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  return tweets;
}

export type InitialTweets = Prisma.PromiseReturnType<typeof getInitialTweets>;

export const metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function Tweets() {
  const initialTweets = await getInitialTweets();

  return (
    <div>
      <TweetList initialTweets={initialTweets} />
    </div>
  );
}
