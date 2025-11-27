'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import SeatMap from '../../../components/SeatMap';
import { seatService } from '../../../services/seatService';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from './page.module.css';

export default function FlightSeatsViewPage() {
  const router = useRouter();
  const params = useParams();
  const vueloId = params.vueloId;

  const [loading, setLoading] = useState(true);
  const [vuelo, setVuelo] = useState(null);
  const [asientos, setAsientos] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    ocupados: 0,
    primeraClase: 0,
    segundaClase: 0
  });

  useEffect(() => {
    loadFlightData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vueloId]);

  const loadFlightData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener información del vuelo
      const vueloResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/vuelos/${vueloId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!vueloResponse.ok) {
        throw new Error('Vuelo no encontrado');
      }

      const vueloData = await vueloResponse.json();
      setVuelo(vueloData.data || vueloData);

      // Obtener asientos del vuelo
      const asientosData = await seatService.getAsientosByVueloId(vueloId);
      setAsientos(asientosData);

      // Calcular estadísticas
      const stats = {
        total: asientosData.length,
        disponibles: asientosData.filter(a => a.estado === 'DISPONIBLE').length,
        ocupados: asientosData.filter(a => a.estado === 'OCUPADO').length,
        primeraClase: asientosData.filter(a => a.clase === 'PRIMERACLASE').length,
        segundaClase: asientosData.filter(a => a.clase === 'SEGUNDACLASE').length
      };
      setStats(stats);

    } catch (error) {
      console.error('Error loading flight data:', error);
      setError(error.message || 'Error al cargar información del vuelo');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = () => {
    // No hacer nada - vista de solo lectura
    return;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Cargando información del vuelo...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <button onClick={() => router.push('/flights')} className={styles.backButton}>
              Volver a Vuelos
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!vuelo) {
    return null;
  }

  const tipoVuelo = vuelo.ruta?.es_nacional ? 'NACIONAL' : 'INTERNACIONAL';

  return (
    <div className={styles.pageContainer}>
      <Header />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.push('/flights')} className={styles.backButton}>
            ← Volver a Vuelos
          </button>
          <h1>🛫 Disponibilidad de Asientos</h1>
          <p className={styles.subtitle}>Vista de ocupación en tiempo real</p>
        </div>

        {/* Información del Vuelo */}
        <div className={styles.flightInfo}>
          <div className={styles.infoCard}>
            <h3>Información del Vuelo</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Número de Vuelo:</span>
                <span className={styles.infoValue}>#{vuelo.ccv}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ruta:</span>
                <span className={styles.infoValue}>
                  {vuelo.ruta?.ciudad_origen?.nombre_ciudad} → {vuelo.ruta?.ciudad_destino?.nombre_ciudad}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Fecha:</span>
                <span className={styles.infoValue}>{formatDate(vuelo.fecha_vuelo)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Hora de Salida:</span>
                <span className={styles.infoValue}>{formatTime(vuelo.hora_salida_vuelo)}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Tipo de Vuelo:</span>
                <span className={styles.infoValue}>{tipoVuelo}</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className={styles.statsCard}>
            <h3>Estadísticas de Ocupación</h3>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>{stats.total}</div>
                <div className={styles.statLabel}>Total Asientos</div>
              </div>
              <div className={styles.statItem} style={{color: '#10b981'}}>
                <div className={styles.statNumber}>{stats.disponibles}</div>
                <div className={styles.statLabel}>Disponibles</div>
              </div>
              <div className={styles.statItem} style={{color: '#ef4444'}}>
                <div className={styles.statNumber}>{stats.ocupados}</div>
                <div className={styles.statLabel}>Ocupados</div>
              </div>
            </div>
            <div className={styles.classStats}>
              <div className={styles.classItem}>
                <span>Primera Clase:</span>
                <strong>{stats.primeraClase} asientos</strong>
              </div>
              <div className={styles.classItem}>
                <span>Segunda Clase:</span>
                <strong>{stats.segundaClase} asientos</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa */}
        <div className={styles.infoNote}>
          <p>ℹ️ Esta es una vista de solo lectura. Los asientos en verde están disponibles y los rojos están ocupados.</p>
          <p>Para reservar, inicia sesión y realiza una reserva desde la página de vuelos.</p>
        </div>

        {/* Mapa de Asientos */}
        <div className={styles.seatMapSection}>
          <SeatMap
            asientos={asientos}
            currentUserSeats={[]}
            selectedSeatId={null}
            onSeatSelect={handleSeatClick}
            tipoVuelo={tipoVuelo}
            claseReserva="SEGUNDACLASE"
            readOnly={true}
          />
        </div>

        {/* Llamado a la acción */}
        <div className={styles.ctaSection}>
          <h3>¿Listo para volar?</h3>
          <p>Reserva tu asiento ahora y asegura tu viaje</p>
          <button onClick={() => router.push('/flights')} className={styles.ctaButton}>
            Ver Todos los Vuelos
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
