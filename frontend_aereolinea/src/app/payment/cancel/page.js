"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservaId = searchParams.get('reserva_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-yellow-500 mb-6">
            <svg
              className="w-24 h-24 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pago Cancelado
          </h2>
          
          <p className="text-xl text-gray-700 mb-8">
            Has cancelado el proceso de pago
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm text-yellow-800">
                  Tu reserva sigue activa. Recuerda que tienes 24 horas desde la fecha de reserva para completar el pago, de lo contrario será cancelada automáticamente.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Puedes intentar nuevamente el pago desde tus reservas activas
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/account/reservations')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Mis Reservas
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Buscar Más Vuelos
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
