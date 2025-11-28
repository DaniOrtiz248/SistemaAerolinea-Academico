"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { reservationService } from "../../services/reservationService";
import LoadingScreen from "../../components/LoadingScreen";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const reservaId = searchParams.get('reserva_id');

        if (!sessionId || !reservaId) {
          setError('Información de pago incompleta');
          setLoading(false);
          return;
        }

        // Verificar el pago con Stripe
        const verifyResponse = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          throw new Error(verifyData.error || 'Error al verificar el pago');
        }

        if (verifyData.status === 'paid') {
          // Crear registro de compra antes de procesar el pago
          try {
            const compraData = {
              fecha_compra: new Date().toISOString(),
              valor_total: verifyData.amount_total,
              es_pago: 1, // Indicar que es un pago
            };
            
            console.log('💼 Creando registro de compra...');
            await reservationService.createPurchase(compraData);
            console.log('✅ Registro de compra creado');
          } catch (compraError) {
            console.error('⚠️ Error al crear registro de compra (continuando con procesamiento):', compraError);
            // No fallar si esto falla, continuar con el procesamiento del pago
          }

          // Procesar el pago en el backend (marcar como PAGADA y enviar correos)
          console.log('📧 Procesando pago y enviando correos...');
          const result = await reservationService.procesarPago(reservaId);
          
          setPaymentInfo({
            reservaId: reservaId,
            amount: verifyData.amount_total,
            correosEnviados: result.correos_enviados,
            codigoReserva: verifyData.metadata?.codigo_reserva,
          });
        } else {
          setError('El pago no fue completado correctamente');
        }
      } catch (err) {
        console.error('Error procesando pago:', err);
        setError(err.message || 'Error al procesar el pago');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return <LoadingScreen message="Verificando pago..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-red-500 mb-6">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Error en el Pago
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex gap-4 justify-center">
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
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-green-500 mb-6">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¡Pago Exitoso! 🎉
          </h2>
          
          <p className="text-xl text-gray-700 mb-8">
            Tu reserva ha sido confirmada y pagada
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Código de Reserva</p>
                <p className="text-lg font-bold text-gray-900">
                  #{paymentInfo?.codigoReserva || paymentInfo?.reservaId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monto Pagado</p>
                <p className="text-lg font-bold text-gray-900">
                  ${paymentInfo?.amount?.toFixed(2)} USD
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-500"
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
                <p className="text-sm text-blue-800">
                  Se han enviado <strong>{paymentInfo?.correosEnviados || 0} correos de confirmación</strong> con los detalles de tu vuelo y tarjetas de embarque.
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Puedes ver todos los detalles de tu reserva en la sección &quot;Historial&quot;
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/account/history')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Ver Historial
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
