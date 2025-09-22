'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ResetPassLogin() {
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showResetPanel, setShowResetPanel] = useState(false);
  const [resetState, setResetState] = useState({
    sending: false,
    sent: false,
    pin: '',
    newPassword: '',
    confirmPassword: ''
  });

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
      const res = await fetch('http://localhost:3001/api/v1/users/login/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginData.identifier,
          contrasena: loginData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en inicio de sesión');
      alert('Inicio de sesión exitoso');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Enviar solicitud para generar y enviar PIN
  const sendResetPin = async () => {
    if (!loginData.identifier) {
      alert('Ingrese su usuario o correo');
      return;
    }
    setResetState(s => ({ ...s, sending: true }));
    try {
      const res = await fetch('http://localhost:3001/api/v1/users/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginData.identifier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo solicitar PIN');
      setResetState(s => ({ ...s, sending: false, sent: true }));
      alert('PIN enviado (revisar email). En desarrollo el PIN puede aparecer en logs del servidor.');
    } catch (err) {
      setResetState(s => ({ ...s, sending: false }));
      alert('Error: ' + err.message);
    }
  };

  // Enviar PIN + nueva contraseña
  const submitReset = async () => {
    const { pin, newPassword, confirmPassword } = resetState;
    if (!pin || !newPassword) {
      alert('Complete PIN y nueva contraseña');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/api/v1/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginData.identifier,
          pin,
          nueva_contrasena: newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo restablecer contraseña');
      alert('Contraseña actualizada. Iniciando sesión...');
      // auto-login opcional:
      setLoginData(prev => ({ ...prev, password: newPassword }));
      setShowResetPanel(false);
      // Opcional: llamar handleLogin() o redirigir
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Bienvenido de Vuelta</h1>
            <p className="text-lg md:text-xl">Inicia sesión para acceder a tu cuenta y gestionar tus vuelos</p>
          </div>
        </div>
        <div className="absolute right-10 top-10 text-white text-4xl opacity-20 hidden lg:block">✈️</div>
      </section>

      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 pb-16">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
            <p className="text-gray-600">Accede a tu cuenta de Aero Penguin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={loginData.identifier}
                  onChange={handleInputChange}
                  placeholder="Usuario o correo electrónico"
                  required
                  className="w-full px-4 py-3 border placeholder-gray-300 text-black-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  placeholder="Tu contraseña"
                  required
                  className="w-full px-4 py-3 border placeholder-gray-300 text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              {!showResetPanel ? (
                <button type="button" onClick={() => setShowResetPanel(true)} className="text-sm text-blue-600 hover:text-blue-800 transition-colors">¿Olvidaste tu contraseña?</button>
              ) : (
                <div className="w-full">
                  {!resetState.sent ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 text-center">Se enviará un PIN al correo registrado.</p>
                      <div className="flex gap-2">
                        <button type="button" onClick={sendResetPin} disabled={resetState.sending} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded">Enviar PIN</button>
                        <button type="button" onClick={() => setShowResetPanel(false)} className="w-20 bg-gray-200 text-black py-2 rounded">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Ingrese PIN"
                        value={resetState.pin}
                        onChange={(e) => setResetState(s => ({ ...s, pin: e.target.value }))}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="Nueva contraseña"
                        value={resetState.newPassword}
                        onChange={(e) => setResetState(s => ({ ...s, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        value={resetState.confirmPassword}
                        onChange={(e) => setResetState(s => ({ ...s, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border rounded"
                      />
                      <div className="flex gap-2">
                        <button type="button" onClick={submitReset} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Restablecer</button>
                        <button type="button" onClick={() => setShowResetPanel(false)} className="w-20 bg-gray-200 text-black py-2 rounded">Cancelar</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl">Iniciar Sesión</button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">¿No tienes una cuenta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">Regístrate aquí</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">¿Por qué crear una cuenta con Aero Penguin?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center"><div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span className="text-2xl">🎯</span></div><h3 className="font-semibold text-gray-900 mb-2">Reservas Rápidas</h3><p className="text-gray-600 text-sm">Guarda tus datos y realiza reservas en segundos</p></div>
            <div className="text-center"><div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span className="text-2xl">💰</span></div><h3 className="font-semibold text-gray-900 mb-2">Ofertas Exclusivas</h3><p className="text-gray-600 text-sm">Accede a descuentos y promociones especiales</p></div>
            <div className="text-center"><div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"><span className="text-2xl">📱</span></div><h3 className="font-semibold text-gray-900 mb-2">Gestión Total</h3><p className="text-gray-600 text-sm">Administra tus vuelos, check-in y más</p></div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}