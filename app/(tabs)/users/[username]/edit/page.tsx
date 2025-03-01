import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import EditProfile from "./(components)/EditProfile";
import { getUser } from "../actions";

export async function getIsOwner(userId?: number) {
  const session = await getSession();
  return !!session?.id && !!userId && session.id === userId;
}

const EditProfilePage = async ({
  params,
}: {
  params: { username: string };
}) => {
  const user = await getUser(params.username);

  if (!user) {
    return redirect("/login");
  }

  const id = user.id ? Number(user.id) : undefined;
  const isOwner = await getIsOwner(id);

  if (!isOwner) {
    return redirect(`/users/${user.username}`);
  }

  return <EditProfile params={params} />;
};

export default EditProfilePage;
