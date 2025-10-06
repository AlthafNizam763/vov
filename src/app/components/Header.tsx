'use client'

import Link from 'next/link'
import { AiFillHeart } from 'react-icons/ai'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import TopBar from './Topbar'

export default function NavBar() {
  const [showNav, setShowNav] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false)
      } else {
        setShowNav(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500
    ${showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
  `}
        onClick={() => !showNav && setShowNav(true)} // Add this line
        style={{ cursor: !showNav ? 'pointer' : 'default' }} // Optional: show pointer when hidden
      >
        <TopBar />
        <nav className="bg-white shadow-sm w-full">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/vov-logo.png"
                alt="Voice of the voiceless logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-gray-900 font-semibold text-lg">
                Voice of the voiceless
              </span>
            </Link>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex items-center px-2 py-1 border rounded text-[#58A3DC] border-[#58A3DC]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Center Links (desktop) */}
            <div className="hidden md:flex items-center space-x-8 text-[#58A3DC] font-medium">
              <Link href="#who-we-are" className="hover:text-[#58A3DC] flex items-center gap-1">
                Who we are
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="#campaigns" className="hover:text-[#58A3DC]">
                Our Campaign
              </Link>
              <Link href="#news" className="hover:text-[#58A3DC]">
                News
              </Link>
              <Link href="#contact" className="hover:text-[#58A3DC]">
                Contact Us
              </Link>
            </div>

            {/* Donate Button (desktop) */}
            <Link
              href="#donate"
              className="hidden md:inline-flex items-center border border-[#58A3DC] text-[#58A3DC] hover:bg-sky-50 px-4 py-2 rounded-lg font-semibold transition"
            >
              Donate Now
              <AiFillHeart className="ml-2 text-[#58A3DC]" />
            </Link>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white px-4 pb-4 pt-2 shadow">
              <Link href="#who-we-are" className="block py-2 text-[#58A3DC] font-medium">
                Who we are
              </Link>
              <Link href="#campaigns" className="block py-2 text-[#58A3DC] font-medium">
                Our Campaign
              </Link>
              <Link href="#news" className="block py-2 text-[#58A3DC] font-medium">
                News
              </Link>
              <Link href="#contact" className="block py-2 text-[#58A3DC] font-medium">
                Contact Us
              </Link>
              <Link
                href="#donate"
                className="block py-2 mt-2 border border-[#58A3DC] text-[#58A3DC] rounded-lg font-semibold text-center"
              >
                Donate Now
                <AiFillHeart className="ml-2 text-[#58A3DC] inline" />
              </Link>
            </div>
          )}
        </nav>
      </div>
      {/* Spacer */}
      <div style={{ height: '60px' }}></div>
    </>
  )
}
