'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Country, State, City } from 'country-state-city';

export default function Register() {
  const [registerData, setRegisterData] = useState({
    usuario: {
      descripcion_usuario: '',
      correo_electronico: '',
      contrasena: '',
      id_rol: 3 // Valor fijo
    },
    usuarioPerfil: {
      dni_usuario: '',
      primer_nombre: '',
      segundo_nombre: '',
      primer_apellido: '',
      segundo_apellido: '',
      fecha_nacimiento: '',
      pais_nacimiento: '',
      estado_nacimiento: '',
      ciudad_nacimiento: '',
      direccion_facturacion: '',
      id_genero_usuario: 1
    },
    confirmPassword: '',
    acceptTerms: false,
    receivePromotions: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleCountryChange = (e) => {
  const countryCode = e.target.options[e.target.selectedIndex].getAttribute('data-code');
  const countryName = e.target.value;
  
  // Actualizar el país seleccionado
  handleInputChange({
    target: {
      name: 'pais_nacimiento',
      value: countryName
    }
  });

  // Cargar estados del país seleccionado
  const countryStates = State.getStatesOfCountry(countryCode);
  setStates(countryStates);
  setCities([]);

  // Limpiar estado y ciudad seleccionados
  handleInputChange({
    target: {
      name: 'estado_nacimiento',
      value: ''
    }
  });
  handleInputChange({
    target: {
      name: 'ciudad_nacimiento',
      value: ''
    }
  });
};

const handleStateChange = (e) => {
  const stateCode = e.target.options[e.target.selectedIndex].getAttribute('data-code');
  const countryCode = e.target.options[e.target.selectedIndex].getAttribute('data-country');
  const stateName = e.target.value;

  // Actualizar el estado seleccionado
  handleInputChange({
    target: {
      name: 'estado_nacimiento',
      value: stateName
    }
  });

  // Cargar ciudades del estado seleccionado
  const stateCities = City.getCitiesOfState(countryCode, stateCode);
  setCities(stateCities);

  // Limpiar ciudad seleccionada
  handleInputChange({
    target: {
      name: 'ciudad_nacimiento',
      value: ''
    }
  });
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    // Map input names to the correct nested structure
    if ([
      'descripcion_usuario',
      'correo_electronico',
      'contrasena'
    ].includes(name)) {
      setRegisterData(prev => ({
        ...prev,
        usuario: {
          ...prev.usuario,
          [name]: newValue
        }
      }));
    } else if ([
      'dni_usuario',
      'primer_nombre',
      'segundo_nombre',
      'primer_apellido',
      'segundo_apellido',
      'fecha_nacimiento',
      'pais_nacimiento',
      'estado_nacimiento',
      'ciudad_nacimiento',
      'direccion_facturacion',
      'id_genero_usuario'
    ].includes(name)) {
      setRegisterData(prev => ({
        ...prev,
        usuarioPerfil: {
          ...prev.usuarioPerfil,
          [name]: name === 'id_genero_usuario' ? Number(newValue) : newValue
        }
      }));
    } else {
      setRegisterData(prev => ({
        ...prev,
        [name]: newValue
      }));
    }

    // Check password match when either password field changes
    if (name === 'contrasena' || name === 'confirmPassword') {
      if (name === 'contrasena') {
        setPasswordMatch(newValue === registerData.confirmPassword || registerData.confirmPassword === '');
      } else {
        setPasswordMatch(newValue === registerData.usuario.contrasena);
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (registerData.usuario.contrasena !== registerData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    if (!registerData.acceptTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    // Enviar el objeto con la estructura solicitada a la API
    const payload = {
      usuario: registerData.usuario,
      usuarioPerfil: registerData.usuarioPerfil
    };
    fetch('http://localhost:3001/api/v1/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || 'Error en el registro');
        }
        return res.json();
      })
      .then(data => {
        alert('Registro exitoso');
        // Aquí podrías redirigir o limpiar el formulario
      })
      .catch(err => {
        alert('Error: ' + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />

      {/* Register Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Únete a Aero Penguin
            </h1>
            <p className="text-lg md:text-xl">
              Crea tu cuenta y descubre un mundo de posibilidades de viaje
            </p>
          </div>
        </div>
        {/* Decorative airplane */}
        <div className="absolute right-10 top-10 text-white text-4xl opacity-20 hidden lg:block">
          ✈️
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-10 pb-16">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-600">
              Completa los datos para crear tu cuenta de Aero Penguin
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Datos de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="descripcion_usuario" className="block text-sm font-medium text-gray-700 mb-2">Descripción Usuario *</label>
                <input
                  type="text"
                  id="descripcion_usuario"
                  name="descripcion_usuario"
                  value={registerData.usuario.descripcion_usuario}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="correo_electronico" className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo_electronico"
                  name="correo_electronico"
                  value={registerData.usuario.correo_electronico}
                  onChange={handleInputChange}
                  placeholder="ejemplo@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contrasena"
                    name="contrasena"
                    value={registerData.usuario.contrasena}
                    onChange={handleInputChange}
                    placeholder="Ej: MiClaveSegura123"
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10 text-gray-700 placeholder:text-gray-500 focus:text-black"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repite la contraseña"
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10 text-gray-700 placeholder:text-gray-500 focus:text-black ${!passwordMatch ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {!passwordMatch && (<p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>)}
              </div>
            </div>
            {/* El rol es fijo y no editable por el usuario */}
            {/* Datos de Perfil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label htmlFor="dni_usuario" className="block text-sm font-medium text-gray-700 mb-2">DNI *</label>
                <input
                  type="text"
                  id="dni_usuario"
                  name="dni_usuario"
                  value={registerData.usuarioPerfil.dni_usuario}
                  onChange={handleInputChange}
                  placeholder="Ej: 87654321"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="primer_nombre" className="block text-sm font-medium text-gray-700 mb-2">Primer Nombre *</label>
                <input
                  type="text"
                  id="primer_nombre"
                  name="primer_nombre"
                  value={registerData.usuarioPerfil.primer_nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Juan"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="segundo_nombre" className="block text-sm font-medium text-gray-700 mb-2">Segundo Nombre</label>
                <input
                  type="text"
                  id="segundo_nombre"
                  name="segundo_nombre"
                  value={registerData.usuarioPerfil.segundo_nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Carlos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="primer_apellido" className="block text-sm font-medium text-gray-700 mb-2">Primer Apellido *</label>
                <input
                  type="text"
                  id="primer_apellido"
                  name="primer_apellido"
                  value={registerData.usuarioPerfil.primer_apellido}
                  onChange={handleInputChange}
                  placeholder="Ej: García"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="segundo_apellido" className="block text-sm font-medium text-gray-700 mb-2">Segundo Apellido</label>
                <input
                  type="text"
                  id="segundo_apellido"
                  name="segundo_apellido"
                  value={registerData.usuarioPerfil.segundo_apellido}
                  onChange={handleInputChange}
                  placeholder="Ej: López"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
              <div>
                <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  value={registerData.usuarioPerfil.fecha_nacimiento}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
                />
              </div>
               <div>
              <label htmlFor="pais_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">País de Nacimiento *</label>
              <select
                id="pais_nacimiento"
                name="pais_nacimiento"
                value={registerData.usuarioPerfil.pais_nacimiento}
                onChange={handleCountryChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
              >
                <option value="">Seleccione un país</option>
                {Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.name} data-code={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
            <label htmlFor="estado_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">Estado/Provincia *</label>
            <select
              id="estado_nacimiento"
              name="estado_nacimiento"
              value={registerData.usuarioPerfil.estado_nacimiento}
              onChange={handleStateChange}
              required
              disabled={!registerData.usuarioPerfil.pais_nacimiento}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
            >
              <option value="">Seleccione un estado</option>
              {states.map((state) => (
                <option 
                  key={state.isoCode} 
                  value={state.name}
                  data-code={state.isoCode}
                  data-country={state.countryCode}
                >
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ciudad_nacimiento" className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
            <select
              id="ciudad_nacimiento"
              name="ciudad_nacimiento"
              value={registerData.usuarioPerfil.ciudad_nacimiento}
              onChange={handleInputChange}
              required
              disabled={!registerData.usuarioPerfil.estado_nacimiento}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder:text-gray-500 focus:text-black"
            >
              <option value="">Seleccione una ciudad</option>
              {cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

              <div>
                <label htmlFor="direccion_facturacion" className="block text-sm font-medium text-gray-700 mb-2">Dirección de Facturación *</label>
                <input
                  type="text"
                  id="direccion_facturacion"
                  name="direccion_facturacion"
                  value={registerData.usuarioPerfil.direccion_facturacion}
                  onChange={handleInputChange}
                  placeholder="Ej: Av. Siempre Viva 742"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="id_genero_usuario" className="block text-sm font-medium text-gray-700 mb-2">Género *</label>
                <select
                  id="id_genero_usuario"
                  name="id_genero_usuario"
                  value={registerData.usuarioPerfil.id_genero_usuario}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 focus:text-black"
                >
                  <option value={1}>Masculino</option>
                  <option value={2}>Femenino</option>
                  <option value={3}>Otro</option>
                </select>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Requisitos de contraseña:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-center">
                  <span className={`mr-2 ${registerData.usuario.contrasena.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                    {registerData.usuario.contrasena.length >= 8 ? '✓' : '○'}
                  </span>
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[A-Z]/.test(registerData.usuario.contrasena) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/[A-Z]/.test(registerData.usuario.contrasena) ? '✓' : '○'}
                  </span>
                  Al menos una letra mayúscula
                </li>
                <li className="flex items-center">
                  <span className={`mr-2 ${/[0-9]/.test(registerData.usuario.contrasena) ? 'text-green-600' : 'text-gray-400'}`}>
                    {/[0-9]/.test(registerData.usuario.contrasena) ? '✓' : '○'}
                  </span>
                  Al menos un número
                </li>
              </ul>
            </div>

            {/* Terms and Promotions */}
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={registerData.acceptTerms}
                  onChange={handleInputChange}
                  required
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Acepto los{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    términos y condiciones
                  </a>{' '}
                  y la{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    política de privacidad
                  </a>
                  *
                </span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="receivePromotions"
                  checked={registerData.receivePromotions}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Deseo recibir ofertas especiales y promociones por correo electrónico
                </span>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Crear Cuenta
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            {/* Social Register Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="ml-2">Google</span>
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Beneficios de ser miembro de Aero Penguin
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Check-in Rápido</h3>
              <p className="text-gray-600 text-sm">
                Check-in online hasta 24 horas antes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Ofertas Exclusivas</h3>
              <p className="text-gray-600 text-sm">
                Descuentos especiales solo para miembros
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Programa de Puntos</h3>
              <p className="text-gray-600 text-sm">
                Acumula puntos y canjéalos por vuelos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">App Móvil</h3>
              <p className="text-gray-600 text-sm">
                Gestiona todo desde tu teléfono
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
