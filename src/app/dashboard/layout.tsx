import { MainNav } from "@/components/main-nav";
import CustomBackground from "@/components/custom-ui/backgrounds/custom";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <CustomBackground type="animated-grid" />
      </div>
      <MainNav />
      {children}
    </div>
  );
}
