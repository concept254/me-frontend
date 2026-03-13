import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const handleNavClick = (href) => {
    setMenuOpen(false)
    if (location.pathname === '/' && href.startsWith('/#')) {
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-lg font-bold text-white tracking-tight">
          Klaus<span className="text-indigo-400">.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hire me button */}
        <a
          href="/#contact"
          className="hidden md:block text-sm px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition font-medium"
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-white transition"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950 border-t border-gray-800 px-6 py-4 space-y-4">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => handleNavClick(link.href)}
              className="block text-sm text-gray-400 hover:text-white transition"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="block text-sm px-4 py-2 rounded-full bg-indigo-600 text-white text-center font-medium"
          >
            Hire Me
          </a>
        </div>
      )}
    </nav>
  )
}