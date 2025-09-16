'use client';
import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    tripType: 'roundtrip'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching flights with:', searchData);
    // Here you would implement the actual search functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />

      {/* Hero Section with Advertising */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Descubre el Mundo
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Vuela a más de 200 destinos con las mejores tarifas
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold">
                🎉 Ofertas especiales desde $99
              </div>
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold">
                ✨ Vuelos directos disponibles
              </div>
            </div>
          </div>
        </div>
        {/* Decorative airplane */}
        <div className="absolute right-10 top-10 text-white text-6xl opacity-20 hidden lg:block">
          ✈️
        </div>
      </section>

      {/* Flight Search Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Buscar Vuelos
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Trip Type Selection */}
            <div className="flex flex-wrap gap-4 justify-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={searchData.tripType === 'roundtrip'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600"
                />
                <span className="text-gray-700">Ida y vuelta</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={searchData.tripType === 'oneway'}
                  onChange={handleInputChange}
                  className="mr-2 text-blue-600"
                />
                <span className="text-gray-700">Solo ida</span>
              </label>
            </div>

            {/* Flight Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Origin */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origen
                </label>
                <input
                  type="text"
                  name="origin"
                  value={searchData.origin}
                  onChange={handleInputChange}
                  placeholder="Ciudad de origen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Destination */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destino
                </label>
                <input
                  type="text"
                  name="destination"
                  value={searchData.destination}
                  onChange={handleInputChange}
                  placeholder="Ciudad de destino"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Departure Date */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de ida
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={searchData.departureDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Return Date */}
              {searchData.tripType === 'roundtrip' && (
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de vuelta
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={searchData.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Passengers */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pasajeros
                </label>
                <select
                  name="passengers"
                  value={searchData.passengers}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Pasajero' : 'Pasajeros'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                🔍 Buscar Vuelos
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Destinos Populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { city: 'París', country: 'Francia', price: '$299', image: '🗼' },
            { city: 'Tokyo', country: 'Japón', price: '$599', image: '🏯' },
            { city: 'Nueva York', country: 'EE.UU.', price: '$399', image: '🗽' },
            { city: 'Londres', country: 'Reino Unido', price: '$349', image: '🏰' }
          ].map((destination, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-4xl">
                {destination.image}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900">{destination.city}</h3>
                <p className="text-gray-600">{destination.country}</p>
                <p className="text-blue-600 font-bold text-xl mt-2">Desde {destination.price}</p>
                <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Vuelos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Ofertas Especiales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">🌞 Ofertas de Verano</h3>
              <p className="text-lg mb-4">Descuentos de hasta 40% en vuelos a destinos de playa</p>
              <button className="bg-white text-orange-500 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Ver Ofertas
              </button>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">✈️ Vuelos de Último Minuto</h3>
              <p className="text-lg mb-4">Grandes descuentos en vuelos que salen esta semana</p>
              <button className="bg-white text-blue-500 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Explorar
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
