import { useCaja } from "../hooks/useCaja";
import CajaResumen from "../components/caja/CajaResumen";
import MovimientoForm from "../components/caja/MovimientoForm";
import MovimientoTable from "../components/caja/MovimientoTable";

export default function CajaView() {
  const {
    movimientos,
    clientes,
    formMov,
    setFormMov,
    loading,
    totalCaja,
    totalFiado,
    handleMovimientoSubmit,
    handleDelete,
  } = useCaja();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      <div className="lg:col-span-12">
        <CajaResumen caja={totalCaja} fiado={totalFiado} />
      </div>

      <div className="lg:col-span-4">
        <MovimientoForm
          formMov={formMov}
          setFormMov={setFormMov}
          onSubmit={handleMovimientoSubmit}
          loading={loading}
          clientes={clientes}
        />
      </div>

      <div className="lg:col-span-8">
        <MovimientoTable movimientos={movimientos} onDelete={handleDelete} />
      </div>
    </div>
  );
}
