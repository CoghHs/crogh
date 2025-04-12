import AuthTabBar from "@/components/navigation/AuthTabBar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AuthTabBar />
      {children}
    </div>
  );
}
