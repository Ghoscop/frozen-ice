import { motion } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  IceCream,
  AlertTriangle,
  ArrowUpRight,
  Star,
  ArrowRight
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const salesData = [
  { day: "Seg", sales: 320 },
  { day: "Ter", sales: 480 },
  { day: "Qua", sales: 410 },
  { day: "Qui", sales: 650 },
  { day: "Sex", sales: 580 },
  { day: "Sáb", sales: 890 },
  { day: "Dom", sales: 760 }
];

const products = [
  {
    name: "Chocolate Belga",
    category: "Sorvete artesanal",
    price: "R$ 12,90",
    emoji: "🍫",
    color: "chocolate"
  },
  {
    name: "Morango Cremoso",
    category: "Sorvete de fruta",
    price: "R$ 11,90",
    emoji: "🍓",
    color: "strawberry"
  },
  {
    name: "Cookies & Cream",
    category: "Sorvete especial",
    price: "R$ 14,90",
    emoji: "🍪",
    color: "cookies"
  },
  {
    name: "Pistache",
    category: "Sorvete artesanal",
    price: "R$ 15,90",
    emoji: "🍵",
    color: "pistachio"
  }
];

const stats = [
  {
    title: "Total de vendas",
    value: "1.248",
    change: "+12,5%",
    icon: ShoppingBag,
    color: "purple"
  },
  {
    title: "Faturamento",
    value: "R$ 24.780",
    change: "+15,2%",
    icon: DollarSign,
    color: "blue"
  },
  {
    title: "Produtos cadastrados",
    value: "42",
    change: "+8,4%",
    icon: IceCream,
    color: "pink"
  },
  {
    title: "Estoque baixo",
    value: "05",
    change: "Atenção necessária",
    icon: AlertTriangle,
    color: "orange"
  }
];

const ranking = [
  { name: "Chocolate Belga", amount: "328 vendas", percent: "88%", emoji: "🍫" },
  { name: "Morango Cremoso", amount: "256 vendas", percent: "72%", emoji: "🍓" },
  { name: "Cookies & Cream", amount: "194 vendas", percent: "56%", emoji: "🍪" }
];

export default function Dashboard() {
  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section className="welcome-section">
        <div>
          <span className="welcome-tag">SEU NEGÓCIO MAIS DOCE ✨</span>
          <h2>Olá, Administrador! 👋</h2>
          <p>Vamos acompanhar como está sua sorveteria hoje?</p>
        </div>

        <div className="welcome-icecream">🍦</div>
        <div className="welcome-decoration">❄️</div>
      </section>

      <section className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.title}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={23} />
              </div>

              <div className="stat-details">
                <span>{stat.title}</span>
                <h3>{stat.value}</h3>
                <small className={stat.color === "orange" ? "warning-text" : "positive-text"}>
                  {stat.color !== "orange" && <ArrowUpRight size={14} />}
                  {stat.change}
                </small>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h3>Desempenho de vendas</h3>
              <p>Acompanhe suas vendas durante a semana.</p>
            </div>

            <span className="period-badge">Últimos 7 dias</span>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8955e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8955e9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eee8f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#8955e9"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel ranking-panel">
          <div className="panel-heading">
            <div>
              <h3><Star size={18} fill="#ffb84d" color="#ffb84d" /> Mais vendidos</h3>
              <p>Os sabores favoritos dos clientes.</p>
            </div>
          </div>

          <div className="ranking-list">
            {ranking.map((product, index) => (
              <div className="ranking-item" key={product.name}>
                <span className="ranking-position">{index + 1}</span>
                <span className="ranking-emoji">{product.emoji}</span>

                <div className="ranking-info">
                  <strong>{product.name}</strong>
                  <small>{product.amount}</small>
                  <div className="ranking-track">
                    <div style={{ width: product.percent }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading">
          <div>
            <h3>🍨 Destaques da sorveteria</h3>
            <p>Conheça alguns dos sabores disponíveis.</p>
          </div>

          <button className="view-all">
            Ver produtos <ArrowRight size={16} />
          </button>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <motion.article
              className="product-card"
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={`product-image ${product.color}`}>
                <span>{product.emoji}</span>
                <span className="product-label">Destaque</span>
              </div>

              <div className="product-info">
                <small>{product.category}</small>
                <h4>{product.name}</h4>

                <div className="product-bottom">
                  <strong>{product.price}</strong>
                  <button aria-label={`Ver ${product.name}`}>
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="promo-banner">
        <div>
          <span>UMA EXPERIÊNCIA GELADINHA ❄️</span>
          <h2>Deixe seu dia mais doce!</h2>
          <p>Gerencie sua sorveteria com praticidade e muito sabor.</p>
        </div>

        <div className="promo-emoji">🍧</div>
      </section>
    </motion.div>
  );
}