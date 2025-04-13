import AuthTabBar from "@/components/navigation/AuthTabBar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-6">
      <AuthTabBar />
      {children}
    </div>
  );
}
