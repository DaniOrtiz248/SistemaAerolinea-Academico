'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomPopup from '../components/CustomPopup';
import usePopup from '../hooks/usePopup';


export default function Login() {
  const searchParams = useSearchParams();
  const { popupState, showSuccess, showError, closePopup } = usePopup();
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAccountMessage, setShowAccountMessage] = useState(false);

  useEffect(() => {
    // Verificar si el usuario viene desde "Mi Cuenta"
    const fromAccount = searchParams.get('from');
    if (fromAccount === 'account') {
      setShowAccountMessage(true);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Get the backend URL dynamically
      const getBackendUrl = () => {
        if (typeof window !== 'undefined') {
          // If we're on a mobile device accessing via IP, use the same IP for backend
          const currentHost = window.location.hostname;
          if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
            return `http://${currentHost}:3001`;
          }
        }
        return 'http://localhost:3001';
      };

      const backendUrl = getBackendUrl();
      
      const res = await fetch(`${backendUrl}/api/v1/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: loginData.identifier,
          contrasena: loginData.password
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error en inicio de sesión');
      }
      
      // Store user data in localStorage - the backend returns 'usuario', not 'user'
      const userData = data.usuario;
      localStorage.setItem('user', JSON.stringify(userData));
      
      
      // Redirect based on user role and where they came from
      const fromAccount = searchParams.get('from');
      
      if (userData.id_rol === 1) {
        // Root user - redirect to root dashboard
        window.location.href = '/root/dashboard';
      } else if (userData.id_rol === 2) {
        // Administrator user - redirect to admin dashboard
        showSuccess('Bienvenido Administrador', '¡Inicio de sesión exitoso!');
        setTimeout(() => window.location.href = '/admin', 1500);
      } else if (userData.id_rol === 3) {
        // Regular users
        if (fromAccount === 'account') {
          // If they came from "Mi Cuenta", redirect them there
          showSuccess('Redirigiendo a tu cuenta...', '¡Inicio de sesión exitoso!');
          setTimeout(() => window.location.href = '/account', 1500);
        } else {
          // Otherwise, redirect to home page
          showSuccess('Bienvenido', '¡Inicio de sesión exitoso!');
          setTimeout(() => window.location.href = '/', 1500);
        }
      } else {
        // Fallback for other roles
        showSuccess('Bienvenido', '¡Inicio de sesión exitoso!');
        setTimeout(() => window.location.href = '/', 1500);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />

      {/* Login Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Bienvenido de Vuelta
            </h1>
            <p className="text-lg md:text-xl">
              Inicia sesión para acceder a tu cuenta y gestionar tus vuelos
            </p>
          </div>
        </div>
        {/* Decorative airplane */}
        <div className="absolute right-10 top-10 text-white text-4xl opacity-20 hidden lg:block">
          ✈️
        </div>
      </section>

      {/* Login Form Section */}
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 pb-16">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu cuenta de Aero Penguin
            </p>
          </div>

          {/* Message when coming from "Mi Cuenta" */}
          {showAccountMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Para acceder a tu cuenta</strong>, necesitas iniciar sesión primero. 
                    Después podrás gestionar tu información personal y reservas.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            {/* identifier Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"  
                  id="identifier"
                  name="identifier"
                  value={loginData.identifier}
                  onChange={handleInputChange}
                  placeholder="Usuario"
                  required
                  className="w-full px-4 py-3 border text-gray-700 placeholder-gray-300 text-black-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  required
                  className="w-full px-4 py-3  border placeholder-gray-300 text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-center">
              <Link href="/login/reset" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            ¿Por qué crear una cuenta con Aero Penguin?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reservas Rápidas</h3>
              <p className="text-gray-600 text-sm">
                Guarda tus datos y realiza reservas en segundos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ofertas Exclusivas</h3>
              <p className="text-gray-600 text-sm">
                Accede a descuentos y promociones especiales
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gestión Total</h3>
              <p className="text-gray-600 text-sm">
                Administra tus vuelos, check-in y más
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <CustomPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        title={popupState.title}
        message={popupState.message}
        type={popupState.type}
        onConfirm={popupState.onConfirm}
        confirmText={popupState.confirmText}
        cancelText={popupState.cancelText}
      />
    </div>
  );
}
