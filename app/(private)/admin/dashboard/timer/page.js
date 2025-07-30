"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function TimerConfigPage() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(null);
  const [formData, setFormData] = useState({
    endDate: "",
    endTime: "",
    isActive: true,
    message: "¡Ofertas por tiempo limitado!"
  });

  // Cargar timer actual
  useEffect(() => {
    fetchTimer();
  }, []);

  const fetchTimer = async () => {
    try {
      const response = await fetch("/api/sale-timer");
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        toast.error(data.error || "Error al cargar timer");
        return;
      }
      
      if (data) {
        const date = new Date(data.endDate);
        setTimer(data);
        setFormData({
          endDate: date.toISOString().split('T')[0],
          endTime: date.toTimeString().slice(0, 5),
          isActive: data.isActive,
          message: data.message
        });
      }
    } catch (error) {
      console.error("Error al cargar timer:", error);
      toast.error("Error de conexión al cargar timer");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.endDate || !formData.endTime) {
      toast.error("Por favor, selecciona fecha y hora");
      return;
    }

    setLoading(true);

    try {
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      const response = await fetch("/api/sale-timer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endDate: endDateTime.toISOString(),
          isActive: formData.isActive,
          message: formData.message
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar configuración");
      }

      toast.success("Configuración de ofertas actualizada");
      fetchTimer();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Configuración de Timer</h1>

      <div className="glass-effect p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Timer de Ofertas</h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fecha de finalización</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="input input-bordered"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Hora de finalización</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
              </div>
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Mensaje personalizado (opcional)</span>
              </label>
              <input
                type="text"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Ej: ¡Ofertas por tiempo limitado!"
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Timer activo</span>
              </label>
              <label className="label">
                <span className="label-text-alt">
                  Desactivar el timer ocultará la cuenta regresiva en la página de ofertas
                </span>
              </label>
            </div>
          </div>

          {timer && (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-semibold">Timer actual:</p>
                <p>Finaliza el {new Date(timer.endDate).toLocaleString('es-MX')}</p>
                <p>Estado: {timer.isActive ? 'Activo' : 'Inactivo'}</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Guardando...
                </>
              ) : (
                "Guardar configuración"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 glass-effect p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Instrucciones</h2>
        <ul className="space-y-2 text-sm">
          <li>• El timer mostrará una cuenta regresiva en la página de ofertas</li>
          <li>• Cuando el timer termine, se mostrará "Temporada de Ofertas terminada"</li>
          <li>• Los productos marcados como "En oferta" aparecerán en la sección de ofertas</li>
          <li>• Los productos en oferta NO aparecerán en el catálogo regular</li>
          <li>• Puedes desactivar el timer sin afectar los productos en oferta</li>
        </ul>
      </div>
    </div>
  );
}