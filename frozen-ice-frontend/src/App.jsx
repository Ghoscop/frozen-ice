import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Produtos":
        return <Produtos />;
      default:
        return (
          <div className="page-placeholder">
            <h2>{activePage}</h2>
            <p>Esta página será desenvolvida em breve! 🍦</p>
          </div>
        );
    }
  }

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <Header />
        {renderPage()}
      </main>
    </div>
  );
}