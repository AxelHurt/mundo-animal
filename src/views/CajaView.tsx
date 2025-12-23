import { useCaja } from "../hooks/useCaja";
// 1. IMPORTAMOS EL NUEVO DASHBOARD (y quitamos CajaResumen)
import DashboardCaja from "../components/caja/DashboardCaja";
import MovimientoForm from "../components/caja/MovimientoForm";
import MovimientoTable from "../components/caja/MovimientoTable";

export default function CajaView() {
  // 2. EXTRAEMOS LOS NUEVOS DATOS DEL HOOK
  const {
    movimientos,
    clientes,
    formMov,
    setFormMov,
    loading,
    // Estos son los nuevos:
    totales,
    filtroFecha,
    setFiltroFecha,
    // Funciones
    handleMovimientoSubmit,
    handleDelete,
  } = useCaja();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* 3. COLOCAMOS EL DASHBOARD ARRIBA (Ocupa las 12 columnas) */}
      <div className="lg:col-span-12">
        <DashboardCaja
          totales={totales}
          filtroFecha={filtroFecha}
          setFiltroFecha={setFiltroFecha}
        />
      </div>

      {/* FORMULARIO (Izquierda en PC, Arriba en Móvil) */}
      <div className="lg:col-span-4">
        <MovimientoForm
          formMov={formMov}
          setFormMov={setFormMov}
          onSubmit={handleMovimientoSubmit}
          loading={loading}
          clientes={clientes}
        />
      </div>

      {/* TABLA (Derecha en PC, Abajo en Móvil) */}
      <div className="lg:col-span-8">
        <MovimientoTable
          movimientos={movimientos} // Nota: Estos movimientos ya vienen filtrados por fecha
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
