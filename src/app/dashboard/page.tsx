'use client'
import React, { useState } from 'react';
import { LogOut, Menu, Moon, Settings, Sun, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProfileSettings from '@/components/profile-settings';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes"
import { JobManagement } from '@/components/job-management';
import { AuthGuard } from '@/components/auth-guard';

const Dashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('jobs');
  const { setTheme, theme } = useTheme()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'GET',
    });
    router.push('/auth/signin');
  }

  return (
    <AuthGuard>
      <SidebarProvider>
      <Sidebar>
        {/* Sidebar content */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === 'jobs'}
                    onClick={() => setActiveTab('jobs')}
                    className="cursor-pointer"
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Briefcase className="mr-2 h-4 w-4" />
                      My Jobs
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                    className="cursor-pointer"
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="cursor-pointer"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                      className="w-full justify-start"
                    >
                      <Sun className="mr-2 h-5 w-5 dark:hidden" />
                      <Moon className="hidden mr-2 h-5 w-5 dark:block" />
                      Switch theme
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center mb-2 relative z-10">
          <SidebarTrigger className="cursor-pointer">
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SidebarTrigger>
        </div>

        {activeTab === 'jobs' && (
          <JobManagement />
        )}
        {activeTab === 'settings' && (
          <ProfileSettings />
        )}
      </div>
    </SidebarProvider>
    </AuthGuard>
  );
};

export default Dashboard;
