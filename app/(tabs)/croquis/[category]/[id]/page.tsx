import CroquisTimer from "@/components/timer/CroquisTimer";
import getSession from "@/lib/session";

export default async function PoseDetail() {
  const session = await getSession();
  const userId = session?.id;
  if (userId === undefined) {
    return <div>로그인 해주세요.</div>;
  }
  return (
    <div>
      <CroquisTimer userId={userId} />
    </div>
  );
}
