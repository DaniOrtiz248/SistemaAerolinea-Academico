"use client";
import { useEffect, useState } from "react";
import Header from "../../components/AdminHeader";

export default function AdminCiudadesPage() {
  const [ciudades, setCiudades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImage, setEditImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imgRefresh, setImgRefresh] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/v1/ciudades")
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          setCiudades(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (id) => {
    setEditId(id);
    setEditImage(null);
    setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editImage || !editId) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.append("imagen", editImage);
    formData.append("id_ciudad", editId);
    try {
      const res = await fetch(`http://localhost:3001/api/v1/uploads/create/ciudad/${editId}`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      let updated = null;
      try {
        updated = await res.json();
      } catch (err) {
        console.error("No se pudo parsear la respuesta JSON:", err);
      }
      if (!res.ok) {
        console.error("Error al subir imagen:", res.status, res.statusText, updated);
        alert(`Error al subir imagen (${res.status}): ${res.statusText}. Verifica que la ruta esté disponible en el backend: /api/v1/images/create/ciudad/${editId}`);
        return;
      }
      console.log("Respuesta backend imagen:", updated);
      // Actualizar la lista de ciudades
      fetch("http://localhost:3001/api/v1/ciudades")
        .then(res => res.json())
        .then(result => {
          console.log("Lista de ciudades tras guardar:", result);
          if (result.success && result.data) {
            setCiudades(result.data);
            // Forzar recarga de imagen agregando un query param aleatorio
            setImgRefresh(prev => ({ ...prev, [editId]: Date.now() }));
          }
        });
      setEditId(null);
      setEditImage(null);
      setPreview(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Ciudades</h2>
        {loading ? (
          <div className="text-center py-8">Cargando ciudades...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ciudades.map(ciudad => (
              <div key={ciudad.id_ciudad} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
                <div className="w-full h-56 mb-4 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                  {ciudad.imagen_ciudad ? (
                    <img src={`http://localhost:3001/${ciudad.imagen_ciudad}${imgRefresh[ciudad.id_ciudad] ? `?v=${imgRefresh[ciudad.id_ciudad]}` : ''}`} alt={ciudad.nombre_ciudad} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-5xl text-gray-400">🏙️</span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{ciudad.nombre_ciudad}</h3>
                <p className="text-gray-500 mb-4">{ciudad.pais || ""}</p>
                {editId === ciudad.id_ciudad ? (
                  <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                    {preview && (
                      <img src={preview} alt="Preview" className="w-24 h-24 object-cover mb-2" style={{ borderRadius: '0.5rem' }} />
                    )}
                    <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded">
                      {submitting ? "Guardando..." : "Guardar Imagen"}
                    </button>
                  </form>
                ) : (
                  <button onClick={() => handleEdit(ciudad.id_ciudad)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Editar Imagen
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
