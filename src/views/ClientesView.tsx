import { useClientes } from "../hooks/useClientes";
import ClienteForm from "../components/clientes/ClienteForm";
import ClienteTable from "../components/clientes/ClienteTable";

export default function ClientesView() {
  const { clientes, loading, formCliente, setFormCliente, handleCrearCliente } =
    useClientes();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
      <div className="md:col-span-4">
        <ClienteForm
          formCliente={formCliente}
          setFormCliente={setFormCliente}
          onSubmit={handleCrearCliente}
          loading={loading}
        />
      </div>
      <div className="md:col-span-8">
        <ClienteTable clientes={clientes} />
      </div>
    </div>
  );
}
