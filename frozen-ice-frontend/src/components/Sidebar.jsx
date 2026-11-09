
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  IceCream,
  ShoppingCart,
  Users,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  Snowflake
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Produtos", icon: IceCream },
  { name: "Vendas", icon: ShoppingCart },
  { name: "Clientes", icon: Users },
  { name: "Usuários", icon: Users },
  { name: "Relatórios", icon: ChartNoAxesCombined },
  { name: "Configurações", icon: Settings }
];

export default function Sidebar({
  activePage,
  setActivePage,
  onLogout,
  usuario
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <IceCream size={34} />
          <Snowflake className="brand-snow" size={15} />
        </div>

        <h1>FROZEN<span>-ICE</span></h1>
        <p>Um mundo de sabores!</p>
      </div>

      <div className="menu-label">MENU PRINCIPAL</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <motion.button
              key={item.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
              className={`menu-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="sidebar-promo">
        <span>🍨</span>
        <h3>Um sabor para cada momento!</h3>
        <p>Descubra nossas delícias geladas.</p>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
        {(usuario?.nome || usuario?.name || usuario?.email || "U")
          .charAt(0)
          .toUpperCase()}
        </div>
      <div>
          <strong>
          {usuario?.nome || usuario?.name || usuario?.email || "Usuário"}
          </strong>
          <small>
          {usuario?.perfil || usuario?.role || "Funcionário"}
          </small>
        </div>

        <button
          type="button"
          className="sidebar-logout-button"
          onClick={onLogout}
          title="Sair do sistema"
          aria-label="Sair do sistema"
        >
          <LogOut size={19} />
        </button>
      </div>
    </aside>
  );
}
