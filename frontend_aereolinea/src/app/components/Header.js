'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  // Don't render header for root users and administrators (they have their own dashboard headers)
  if (isMounted && user && (user.id_rol === 1 || user.id_rol === 2)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Image
                src="/logo.png"
                alt="Aero Penguin Logo"
                width={120}
                height={120}
                className="rounded-lg"
              />
              <div className="text-2xl font-bold text-blue-600">
                Aero Penguin
              </div>
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Vuelos
              </a>
              <a href="#" className="text-gray-900 hove r:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Destinos
              </a>
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Check-in
              </a>
              {user && user.id_rol === 3 ? (
                <Link href="/account" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Mi Cuenta
                </Link>
              ) : (
                <Link href="/login?from=account" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Mi Cuenta
                </Link>
              )}
              
              {/* Authentication section */}
              {isMounted ? (
                user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 text-sm">
                      Hola, {user.descripcion_usuario}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Iniciar Sesión
                  </Link>
                )
              ) : (
                <Link href="/login" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-900 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMounted && isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Vuelos
              </a>
              <a href="#" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Destinos
              </a>
              <a href="#" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Check-in
              </a>
              {user && user.id_rol === 3 ? (
                <Link href="/account" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Mi Cuenta
                </Link>
              ) : (
                <Link href="/login?from=account" className="text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Mi Cuenta
                </Link>
              )}
              
              {/* Authentication section for mobile */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="px-3 py-2">
                    <div className="text-gray-700 text-sm mb-2">
                      Hola, {user.descripcion_usuario}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Link 
                      href="/login" 
                      className="block w-full text-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
