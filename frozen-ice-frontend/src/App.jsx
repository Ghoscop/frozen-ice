import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Notificacoes from "./pages/Notificacoes";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Usuarios from "./pages/Usuarios";
import HistoricoVendas from "./pages/HistoricoVendas";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  function handleLogout() {
    setUsuarioLogado(null);
    setActivePage("Dashboard");
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Produtos":
        return <Produtos />;

      case "Vendas":
        return <Vendas />;

      case "Clientes":
        return <Clientes />;

      case "Usuários":
        return <Usuarios />;

      case "Relatórios":
        return <HistoricoVendas />;

      case "Notificações":
        return <Notificacoes />;

      default:
        return (
          <div className="page-placeholder">
            <h2>{activePage}</h2>
            <p>Esta página será desenvolvida em breve! 🍦</p>
          </div>
        );
    }
  }

  if (!usuarioLogado) {
    return <Login onLogin={setUsuarioLogado} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        usuario={usuarioLogado}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <Header
          usuario={usuarioLogado}
          onLogout={handleLogout}
          onOpenNotifications={() => setActivePage("Notificações")}
        />

        {renderPage()}
      </main>
    </div>
  );
}