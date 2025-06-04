'use client'

import { Document } from '@/constants';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import { Common } from '@/constants';
import { useEffect, useState } from 'react';
import { MessageSquarePlus } from 'lucide-react'

type AutoBacklinks = { url: string, label: string }[]
type WindowWithBacklinks = Window & typeof globalThis & { onBacklinksLoaded: (data: AutoBacklinks) => void, Backlinks: AutoBacklinks }

export default function Footer() {
  const [backlinks, setBacklinks] = useState<{ url: string, label: string }[]>([])

  useEffect(() => {
    (window as WindowWithBacklinks).onBacklinksLoaded = (data: AutoBacklinks) => {
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

  return (
    <div className="w-full">
      <Script src={`${Document.scripts.autoBackLink}`} defer async />
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-background">
        <div className={`pt-2 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 ${process.env.NODE_ENV === 'production' ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
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
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
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
            href="https://insigh.to/b/joblet"
            target="_blank"
            className="hover:underline transition-colors duration-200"
          >
            <MessageSquarePlus size={18} />
          </Link>
        </div>
        <div className="fixed bottom-0 right-0 p-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-black text-sm rounded-tl-lg z-10">
          <Link
            href="https://lutfifadlan.com"
            target="_blank"
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