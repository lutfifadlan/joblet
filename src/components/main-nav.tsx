'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { LogIn, Menu, X, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { Common } from '@/constants';
import { showErrorToast, showSuccessToast } from '@/lib/toast';
import { ThemeToggle } from '@/components/theme-toggle';

export function MainNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.valid);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [pathname]); // Re-check auth when pathname changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });
      
      if (response.ok) {
        showSuccessToast('Signed out successfully');
        setIsAuthenticated(false);
        window.location.href = '/';
      } else {
        showErrorToast('Failed to sign out');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      showErrorToast('An error occurred while signing out');
    }
  };

  // Define the route type
  type Route = {
    href: string;
    label: string;
    active: boolean;
    icon: React.ReactNode;
    showAlways?: boolean;
    showWhenAuthenticated?: boolean;
    showWhenNotAuthenticated?: boolean;
    onClick?: () => void;
  };

  const routes: Route[] = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      active: pathname === '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      showWhenAuthenticated: true
    },
    {
      href: '/jobs',
      label: 'Jobs',
      active: pathname === '/jobs',
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      showAlways: true
    },
    {
      href: '/auth/signin',
      label: 'Sign In',
      active: pathname === '/auth/signin',
      icon: <LogIn className="h-4 w-4 mr-2" />,
      showWhenNotAuthenticated: true
    }
  ];
  
  // Add sign out option when authenticated
  if (isAuthenticated) {
    routes.push({
      href: '#',
      label: 'Sign Out',
      active: false,
      icon: <LogOut className="h-4 w-4 mr-2" />,
      onClick: handleSignOut,
      showWhenAuthenticated: true
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center mx-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Common.logo} alt="Joblet" width={30} height={30} />
            <span className="font-bold">{Common.title}</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {routes.map((route) => {
            // Determine if the route should be shown
            const showRoute = 
              route.showAlways || 
              (route.showWhenAuthenticated && isAuthenticated) || 
              (route.showWhenNotAuthenticated && !isAuthenticated);
            
            if (!showRoute) return null;
            
            return route.onClick ? (
              <button
                key={route.href}
                onClick={route.onClick}
                className={cn(
                  "cursor-pointer font-medium transition-colors hover:text-primary flex items-center",
                  route.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </button>
            ) : (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "font-medium transition-colors hover:text-primary flex items-center",
                  route.active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            );
          })}
          <div>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden ml-auto" 
          onClick={toggleMenu}
          size="sm"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background border-b p-4 shadow-lg">
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => {
                // Determine if the route should be shown
                const showRoute = 
                  route.showAlways || 
                  (route.showWhenAuthenticated && isAuthenticated) || 
                  (route.showWhenNotAuthenticated && !isAuthenticated);
                
                if (!showRoute) return null;
                
                return route.onClick ? (
                  <button
                    key={route.href}
                    className={cn(
                      "cursor-pointer font-medium transition-colors hover:text-primary flex items-center p-2 w-full text-left",
                      route.active ? "text-primary bg-muted" : "text-muted-foreground"
                    )}
                    onClick={() => {
                      setIsMenuOpen(false);
                      route.onClick?.();
                    }}
                  >
                    {route.icon}
                    {route.label}
                  </button>
                ) : (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "font-medium transition-colors hover:text-primary flex items-center p-2",
                      route.active ? "text-primary bg-muted" : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {route.icon}
                    {route.label}
                  </Link>
                );
              })}
              <div className="mt-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
