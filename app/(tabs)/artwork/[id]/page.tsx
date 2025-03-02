import Image from "next/image";
import { TrashIcon, UserIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import LikeButton from "@/components/button/LikeButton";
import UserArtworkList from "@/components/artwork/UserArtworkList";

async function getIsOwner(userId: number) {
  const session = await getSession();
  return session?.id === userId;
}

async function getArtwork(id: number) {
  try {
    const artwork = await db.artwork.findUnique({
      where: { id },
      select: {
        id: true,
        created_at: true,
        updated_at: true,
        description: true,
        title: true,
        photo: true,
        likes: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
    return artwork;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getLikeStatus(artworkId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: { id: { artworkId, userId } },
  });
  const likeCount = await db.like.count({ where: { artworkId } });
  return { likeCount, isLiked: Boolean(isLiked) };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

async function getArtworkTitle(id: number) {
  const artwork = await db.artwork.findUnique({
    where: { id },
    select: { title: true },
  });
  return artwork;
}

async function getUserArtworks(userId: number) {
  const userArtworks = await db.artwork.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      description: true,
      photo: true,
      created_at: true,
      updated_at: true,
    },
  });
  return userArtworks;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const artwork = await getArtworkTitle(Number(params.id));
  return {
    title: artwork?.title,
  };
}

export default async function ArtWorkDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }

  const artwork = await getArtwork(id);
  if (!artwork) {
    return notFound();
  }

  const isOwner = await getIsOwner(artwork.user.id);
  const { likeCount, isLiked } = await getCachedLikeStatus(id);

  const userArtworks = await getUserArtworks(artwork.user.id);

  const onDelete = async () => {
    "use server";
    if (!isOwner) return;
    await db.artwork.delete({ where: { id } });
    redirect("/artworks");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 이미지 영역 */}
      <div className="w-5/6 relative rounded-2xl shadow-md">
        <Image
          className="rounded-lg object-contain"
          fill
          priority
          src={`${artwork.photo}/homenav`}
          alt={artwork.title}
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex w-1/3 flex-col p-6 bg-white shadow-md rounded-2xl space-y-1">
        {/* 유저 정보 섹션 */}
        <div className="p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 overflow-hidden rounded-full">
                {artwork.user.avatar ? (
                  <Image
                    src={`${artwork.user.avatar}/bigavatar`}
                    width={100}
                    height={100}
                    alt={artwork.user.username}
                    className="object-cover"
                  />
                ) : (
                  <UserIcon className="w-20 h-20 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-medium text-gray-900">
                  {artwork.user.username}
                </h3>
              </div>
            </div>
            <LikeButton
              isLiked={isLiked}
              likeCount={likeCount}
              artworkId={id}
            />
          </div>
          {isOwner && (
            <form action={onDelete} className="mt-2">
              <button className="text-neutral-400 hover:text-red-500 transition duration-200 flex items-center gap-1">
                <TrashIcon className="w-6 h-6" />
                <span>Delete</span>
              </button>
            </form>
          )}
        </div>

        {/* 게시물 정보 섹션 */}
        <div className="p-4 rounded-lg bg-gray-100">
          <h1 className="text-4xl font-semibold text-gray-800 mb-2">
            {artwork.title}
          </h1>
          <p className="text-gray-600 text-lg ">{artwork.description}</p>
        </div>

        {/* 유저의 다른 게시물 섹션 */}
        <div>
          <div className="text-neutral-500 mb-2 mt-2">
            More by{" "}
            <span className="font-bold text-xl text-neutral-600">
              {artwork.user.username}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {userArtworks.slice(0, 12).map((userArtwork: any) => (
              <UserArtworkList key={userArtwork.id} {...userArtwork} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
