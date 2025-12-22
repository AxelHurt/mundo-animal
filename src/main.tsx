import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// 1. Importamos
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 2. Creamos el cliente
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos los datos se consideran "frescos" (no recarga)
      refetchOnWindowFocus: false, // No recargar si cambio de pestaña del navegador
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. Envolvemos la App */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
