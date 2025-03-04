import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: number;
}

export default async function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "crogh-cookies",
    password: process.env.COKKIE_PASSWORD!,
  });
}
