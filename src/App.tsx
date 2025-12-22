import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginView from "./views/LoginView";
import ClientesView from "./views/ClientesView";
import InventarioView from "./views/InventarioView";
import CajaView from "./views/CajaView";

function AppContent() {
  const { session, loading, signOut } = useAuth();
  const [vista, setVista] = useState<"caja" | "inventario" | "clientes">(
    "caja"
  );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-emerald-200 rounded-full mb-4"></div>
          <div className="text-emerald-800 font-bold text-lg">
            Cargando Mundo Animal...
          </div>
        </div>
      </div>
    );

  if (!session) return <LoginView />;

  // --- CONFIGURACIÓN DE NAVEGACIÓN ---
  const menuItems = [
    { id: "caja", label: "Caja", icon: "💰" },
    { id: "inventario", label: "Inventario", icon: "📦" },
    { id: "clientes", label: "Clientes", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20 md:pb-0">
      {/* ==============================================
          HEADER SUPERIOR (Escritorio y Móvil)
         ============================================== */}
      <nav className="bg-linear-to-r from-emerald-900 to-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* LOGO */}
            <div className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                🐾
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none">
                  Mundo Animal
                </h1>
                <p className="text-[10px] text-emerald-200 uppercase tracking-widest opacity-80">
                  Sistema de Gestión
                </p>
              </div>
            </div>

            {/* NAV DESKTOP (Oculto en móvil) */}
            <div className="hidden md:flex space-x-2 bg-emerald-950/30 p-1 rounded-xl backdrop-blur-md border border-white/10">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setVista(item.id as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2
                    ${
                      vista === item.id
                        ? "bg-white text-emerald-900 shadow-md transform scale-105"
                        : "text-emerald-100 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* BOTÓN SALIR */}
            <button
              onClick={signOut}
              className="group flex items-center gap-2 text-xs font-bold bg-red-500/10 hover:bg-red-500 text-red-100 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/20 transition-all duration-300"
            >
              <span>Salir</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ==============================================
          CONTENIDO PRINCIPAL
         ============================================== */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 animate-fade-in-up">
        {vista === "caja" && <CajaView />}
        {vista === "inventario" && <InventarioView />}
        {vista === "clientes" && <ClientesView />}
      </main>

      {/* ==============================================
          NAVBAR INFERIOR (Solo Móvil) 📱
         ============================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setVista(item.id as any)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                ${
                  vista === item.id
                    ? "text-emerald-600 border-t-2 border-emerald-600 bg-emerald-50/50"
                    : "text-slate-400 hover:text-slate-600 border-t-2 border-transparent"
                }`}
            >
              <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wide">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
