"use client"
import { Home, FileCodeIcon, LogOut, CodeIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Practice",
    url: "/practice",
    icon: FileCodeIcon,
  }
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "GET" });
      if (!res.ok) {
        throw new Error("Logout failed");
      }
      // Optionally clear client-side state here if needed
      router.push("/signin");
    } catch {
      toast.error("Failed to logout");
      // Do NOT redirect to /signin if logout fails, to avoid redirect loop
    }
  }, [router]);

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2 font-bold text-xl">
          <CodeIcon className="h-6 w-6" />
          <span>Joblet</span>
        </div>
      </SidebarHeader>
      <SidebarContent>  
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem key="Logout">
            <SidebarMenuButton asChild>
              <button type="button" onClick={handleLogout} className="flex items-center w-full gap-2 px-2 py-1">
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
