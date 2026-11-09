
import { Bell, Search, ChevronDown, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ onLogout, usuario }) {
  return (
    <header className="top-header">
      <div className="search-box">
        <Search size={19} />
        <input
          type="text"
          placeholder="Buscar produtos, vendas..."
        />
        <span className="search-shortcut">⌘ K</span>
      </div>

      <div className="header-actions">
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="notification-button"
          aria-label="Notificações"
        >
          <Bell size={21} />
          <span className="notification-dot"></span>
        </motion.button>

        <div className="header-profile">
        <div className="profile-avatar">
          {(usuario?.nome || usuario?.name || usuario?.email || "U")
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="profile-info">
          <strong>
            {usuario?.nome || usuario?.name || usuario?.email || "Usuário"}
          </strong>

          <small>Bem-vindo!</small>
        </div>

        <ChevronDown size={17} />
      </div>
    </div>
  </header>
  );
}
