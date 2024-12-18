import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getUsers() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        username: true,
        avatar: true,
      },
    });
    return user;
  }
}
