'use client'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, MessageSquarePlus, X } from 'lucide-react'
import Image from 'next/image'
import { Common, Document } from '@/constants'
import Script from 'next/script'

type AutoBacklinks = { url: string, label: string }[]
type WindowWithBacklinks = Window & typeof globalThis & { onBacklinksLoaded: (data: AutoBacklinks) => void, Backlinks: AutoBacklinks }

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [backlinks, setBacklinks] = useState<{ url: string, label: string }[]>([])

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
  ];

  const router = useRouter();
  const [navLoading, setNavLoading] = useState(false);

  const handleNavClick = useCallback((href: string) => {
    setNavLoading(true);
    router.push(href);
  }, [router]);

  useEffect(() => {
    const handleComplete = () => setNavLoading(false);
    // Next.js App Router does not expose router.events, so fallback to timer
    if (navLoading) {
      const timer = setTimeout(handleComplete, 1200); // fallback
      return () => clearTimeout(timer);
    }
  }, [navLoading]);

  useEffect(() => {
    (window as WindowWithBacklinks).onBacklinksLoaded = (data: { url: string, label: string }[]) => {
      setBacklinks(data)
    }
    const timer = setTimeout(() => {
      // fallback to global backlinks
      if ((window as WindowWithBacklinks).Backlinks?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setBacklinks(links => links?.length ? links : (window as any).Backlinks)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleMobileMenuItemClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="w-full flex justify-between items-center border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-2">
        <Link href="/" className="text-2xl font-bold flex items-center space-x-2">
          <Image src={Common.image} alt="logo" width={40} height={40} priority className="text-white"/>
          <span className="font-bold">{Common.title}</span>
        </Link>
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className="px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
              disabled={navLoading}
              type="button"
            >
              {navLoading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : null}
              {item.label}
            </button>
          ))}
        </nav>
        {/* Mobile menu button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.href} onClick={handleMobileMenuItemClick}>
                <Link
                  href={item.href}
                  className="flex justify-center items-center px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Page content */}
      <main>
        {children}
      </main>

      <Script src={`${Document.scripts.autoBackLink}`} defer async />

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 w-full pt-2 px-4 sm:px-6 relative z-20">
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${process.env.NODE_ENV === 'production' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
          {/* Logo and Description Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className='flex items-center justify-center gap-2'>
              <Image src="/logo.png" alt="logo" width={35} height={35} priority />
              <h1 className="text-xl sm:text-2xl font-bold">{Common.title}</h1>
            </Link>
            <p className="mt-2 text-sm text-center md:text-left">
              {Common.tagline}
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-center sm:text-left">Quick Links</h4>
            <ul className="space-y-2 text-center sm:text-left" aria-label="breadcrumb">
              <li><Link href="/" className="hover:underline">Landing Page</Link></li>
              <li>
                <button
                  onClick={() => handleNavClick('/dashboard')}
                  className="hover:underline flex items-center cursor-pointer"
                  disabled={navLoading}
                  type="button"
                >
                  {navLoading ? (
                    <svg className="animate-spin h-4 w-4 mr-2 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                  ) : null}
                  Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-center sm:text-left">Support</h4>
            <ul className="space-y-2 text-center sm:text-left" aria-label="breadcrumb">
              <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

          {process.env.NODE_ENV === 'production' && (
            <div>
              <h4 className="font-semibold text-lg mb-4 text-center sm:text-left">Indie Friends</h4>
              <div className="flex flex-col gap-4">
                {backlinks.map((item, index) => (
                  <a key={index} href={item.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-4 pt-2 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} {Common.title}. All rights reserved.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 p-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-sm rounded-tr-lg z-10">
          <Link
            href="https://launchcraft.canny.io/feature-requests"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors duration-200"
          >
            <MessageSquarePlus size={18} />
          </Link>
        </div>
        <div className="fixed bottom-0 right-0 p-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-sm rounded-tl-lg z-10">
          <Link
            href="https://lutfifadlan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors duration-200"
          >
            <span className="block sm:hidden pr-2">Lf</span>
            <span className="hidden sm:block">Made by Lutfifadlan</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}