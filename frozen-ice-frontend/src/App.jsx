import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="app-container">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        <Header />

        {activePage === "Dashboard" ? (
          <Dashboard />
        ) : (
          <div className="page-placeholder">
            <h2>{activePage}</h2>
            <p>Estamos preparando esta página do FROZEN-ICE! 🍦</p>
          </div>
        )}
      </main>
    </div>
  );
}