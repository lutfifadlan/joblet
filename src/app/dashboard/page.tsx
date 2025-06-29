'use client'
import React, { useState } from 'react';
import { Menu, Settings, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ProfileSettings from '@/components/profile-settings';
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
import { JobManagement } from '@/components/job-management';
import { AuthGuard } from '@/components/auth-guard';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('jobs');

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
                      className="cursor-pointer mt-14"
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
