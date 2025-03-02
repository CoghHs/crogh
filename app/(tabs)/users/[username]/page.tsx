import Image from "next/image";
import { getUser } from "./actions";
import Link from "next/link";
import LogoutButton from "@/components/button/LogoutButton";
import UserTabBar from "@/components/navigation/UserTabBar";
import getSession from "@/lib/session";

async function getIsOwner(userId: number) {
  const session = await getSession();
  return session?.id === userId;
}

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUser(params.username);
  const id = Number(user?.id);
  const isOwner = await getIsOwner(id);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col justify-center items-center gap-3">
        {user?.avatar ? (
          <Image
            src={`${user?.avatar}/bigavatar`}
            alt="avatar"
            width={128}
            height={128}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="size-32 bg-neutral-200 rounded-full" />
        )}
        <span className="text-4xl font-medium">{user?.username}</span>
        <span className="text-neutral-400">{user?.email}</span>
        {user?.bio ? (
          <span className="text-neutral-500 text-lg">{user?.bio}</span>
        ) : (
          <span className="text-neutral-500 text-lg">
            자기소개를 추가해보세요 !
          </span>
        )}
        <div>
          {isOwner ? (
            <div className="mt-3 flex gap-2">
              <Link
                className="bg-neutral-200 px-5 py-3 rounded-3xl text-lg text-neutral-700 hover:bg-neutral-300 transition"
                href={`/users/${user?.username}/edit`}
              >
                프로필 수정
              </Link>
              <LogoutButton />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <UserTabBar user={user} />
    </div>
  );
}
