import { MainNav } from "@/components/main-nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNav />
      <div className="relative">
        {children}
      </div>
    </>
  );
}
