"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { reservationService } from "../../services/reservationService";

export default function HistoryPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PAGADA, CANCELADA

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const userDataStr = localStorage.getItem("user");
        if (!userDataStr) {
          router.push("/login?from=history");
          return;
        }

        const userData = JSON.parse(userDataStr);
        setUser(userData);

        // Obtener todas las reservas del usuario
        const reservas = await reservationService.getUserReservations(userData.id_usuario);
        // Ordenar por fecha de reserva descendente (más recientes primero)
        const reservasOrdenadas = reservas.sort((a, b) => {
          return new Date(b.fecha_reserva) - new Date(a.fecha_reserva);
        });
        setReservations(reservasOrdenadas);
      } catch (error) {
        console.error("Error loading history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [router]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAGADA":
        return "bg-green-100 text-green-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "ACTIVA":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "PAGADA":
        return "✅ Completada";
      case "CANCELADA":
        return "❌ Cancelada";
      case "ACTIVA":
        return "⏳ Pendiente";
      default:
        return status;
    }
  };

  const filteredReservations = reservations.filter((reserva) => {
    if (filterStatus === "ALL") return true;
    return reserva.estado_reserva === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <Header />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📜 Historial de Reservas y Compras
          </h2>
          <p className="text-gray-600">
            Revisa todas tus transacciones anteriores
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrar por estado:</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Todas ({reservations.length})
            </button>
            <button
              onClick={() => setFilterStatus("PAGADA")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === "PAGADA"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Completadas ({reservations.filter((r) => r.estado_reserva === "PAGADA").length})
            </button>
            <button
              onClick={() => setFilterStatus("ACTIVA")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === "ACTIVA"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pendientes ({reservations.filter((r) => r.estado_reserva === "ACTIVA").length})
            </button>
            <button
              onClick={() => setFilterStatus("CANCELADA")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                filterStatus === "CANCELADA"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Canceladas ({reservations.filter((r) => r.estado_reserva === "CANCELADA").length})
            </button>
          </div>
        </div>

        {/* Lista de Reservas */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-400 mb-4">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay registros con este filtro
            </h3>
            <p className="text-gray-500">
              Intenta cambiar el filtro o realiza tu primera reserva
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reserva) => (
              <div
                key={reserva.id_reserva}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-gray-200"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Reserva #{reserva.codigo_reserva || reserva.id_reserva}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Fecha: {formatDate(reserva.fecha_reserva)}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                          reserva.estado_reserva
                        )}`}
                      >
                        {getStatusLabel(reserva.estado_reserva)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Vuelo</p>
                      <p className="font-semibold text-gray-900">#{reserva.vuelo_ida_id}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Pasajeros</p>
                      <p className="font-semibold text-gray-900">
                        {reserva.cantidad_viajeros} {reserva.cantidad_viajeros === 1 ? "persona" : "personas"}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Clase</p>
                      <p className="font-semibold text-gray-900">
                        {reserva.clase_reserva === "PRIMERACLASE"
                          ? "Primera Clase"
                          : "Segunda Clase"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${reserva.precio_total.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {reserva.estado_reserva === "ACTIVA" && (
                        <button
                          onClick={() => router.push("/account/reservations")}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                          Completar Pago
                        </button>
                      )}
                      
                      {reserva.estado_reserva === "PAGADA" && (
                        <button
                          onClick={() => router.push(`/account/checkin/${reserva.id_reserva}`)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                          ✈️ Check-in y Asientos
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Botón para volver */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/account")}
            className="text-blue-600 hover:text-blue-700 font-semibold underline"
          >
            ← Volver a Mi Cuenta
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
