import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, DollarSign, IceCream, AlertTriangle,
  ArrowUpRight, Star, ArrowRight, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import api from "../services/api";

const moeda = (valor) => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL"
}).format(Number(valor) || 0);

const listaDe = (data) => Array.isArray(data) ? data : (data?.content || data?.data || data?.vendas || data?.produtos || []);
const valorVenda = (v) => Number(v.valorTotal ?? v.total ?? v.valor ?? 0);
const dataVenda = (v) => {
  const raw = v.dataVenda || v.dataHora || v.createdAt || v.data || v.dataCadastro;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
};
const nomeProduto = (item) => item.produto?.nome || item.nomeProduto || item.produtoNome || "Produto";
const itensVenda = (v) => v.itens || v.produtos || v.itensVenda || (v.produto ? [{ produto: v.produto, quantidade: v.quantidade || 1 }] : []);

export default function Dashboard({ onNavigate }) {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const [vendasRes, produtosRes, clientesRes] = await Promise.all([
        api.get("/api/vendas"),
        api.get("/api/produtos"),
        api.get("/api/clientes")
      ]);
      setVendas(listaDe(vendasRes.data));
      setProdutos(listaDe(produtosRes.data));
      setClientes(listaDe(clientesRes.data));
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível carregar os dados do painel. Confira se a API está disponível.");
    } finally { setCarregando(false); }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const hoje = new Date();
  const vendasValidas = useMemo(() => vendas.filter((v) => {
    const d = dataVenda(v);
    return d && d.getFullYear() === hoje.getFullYear() &&
      d.getMonth() === hoje.getMonth() && d.getDate() === hoje.getDate();
  }), [vendas, hoje.toDateString()]);
  const faturamentoHoje = vendasValidas.reduce((s, v) => s + valorVenda(v), 0);
  const estoqueBaixo = produtos.filter((p) => Number(p.estoque ?? p.quantidadeEstoque ?? p.quantidade ?? 0) <= 5);
  const chartData = useMemo(() => {
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const total = vendas.reduce((sum, v) => {
        const vd = dataVenda(v);
        return vd && vd.toDateString() === d.toDateString() ? sum + valorVenda(v) : sum;
      }, 0);
      dias.push({ day: d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""), sales: total });
    }
    return dias;
  }, [vendas]);

  const ranking = useMemo(() => {
    const totais = new Map();
    vendas.forEach((v) => itensVenda(v).forEach((item) => {
      const nome = nomeProduto(item);
      const qtd = Number(item.quantidade ?? item.qtd ?? 1);
      totais.set(nome, (totais.get(nome) || 0) + qtd);
    }));
    return [...totais.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [vendas]);

  const stats = [
    { title: "Vendas hoje", value: String(vendasValidas.length), change: "Registros de hoje", icon: ShoppingBag, color: "purple" },
    { title: "Faturamento hoje", value: moeda(faturamentoHoje), change: "Total das vendas de hoje", icon: DollarSign, color: "blue" },
    { title: "Produtos cadastrados", value: String(produtos.length), change: "Itens no catálogo", icon: IceCream, color: "pink" },
    { title: "Estoque baixo", value: String(estoqueBaixo.length).padStart(2, "0"), change: "Até 5 unidades", icon: AlertTriangle, color: "orange" }
  ];

  return (
    <motion.div className="dashboard" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <section className="welcome-section">
        <div>
          <span className="welcome-tag">SEU NEGÓCIO MAIS DOCE ✨</span>
          <h2>Olá! 👋</h2>
          <p>Confira os indicadores reais da sua sorveteria.</p>
          <button className="view-all" onClick={carregar} disabled={carregando}><RefreshCw size={15} /> Atualizar dados</button>
        </div>
        <div className="welcome-icecream">🍦</div><div className="welcome-decoration">❄️</div>
      </section>

      {erro && <p role="alert" className="dashboard-api-error">{erro}</p>}
      {carregando && <p>Carregando dados do painel...</p>}

      <section className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }} whileHover={{ y: -6 }}>
              <div className={`stat-icon ${stat.color}`}><Icon size={23} /></div>
              <div className="stat-details"><span>{stat.title}</span><h3>{stat.value}</h3>
                <small className={stat.color === "orange" ? "warning-text" : "positive-text"}>
                  {stat.color !== "orange" && <ArrowUpRight size={14} />}{stat.change}
                </small>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <div className="panel sales-panel">
          <div className="panel-heading"><div><h3>Desempenho de vendas</h3><p>Faturamento dos últimos 7 dias.</p></div><span className="period-badge">Últimos 7 dias</span></div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8955e9" stopOpacity={0.35} /><stop offset="100%" stopColor="#8955e9" stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#eee8f5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(v) => moeda(v)} />
                <Area type="monotone" dataKey="sales" stroke="#8955e9" strokeWidth={3} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel ranking-panel">
          <div className="panel-heading"><div><h3><Star size={18} fill="#ffb84d" color="#ffb84d" /> Mais vendidos</h3><p>Produtos com maior quantidade vendida.</p></div></div>
          <div className="ranking-list">
            {ranking.map(([name, amount], index) => {
              const max = ranking[0]?.[1] || 1;
              return <div className="ranking-item" key={name}>
                <span className="ranking-position">{index + 1}</span><span className="ranking-emoji">🍨</span>
                <div className="ranking-info"><strong>{name}</strong><small>{amount} unidades</small>
                  <div className="ranking-track"><div style={{ width: `${Math.round(amount / max * 100)}%` }} /></div>
                </div>
              </div>;
            })}
            {ranking.length === 0 && <p>As vendas de produtos aparecerão aqui.</p>}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="section-heading"><div><h3>🍨 Produtos da sorveteria</h3><p>Itens cadastrados no catálogo.</p></div>
          <button className="view-all" onClick={() => onNavigate?.("Produtos")}>Ver produtos <ArrowRight size={16} /></button>
        </div>
        <div className="products-grid">
          {produtos.slice(0, 4).map((p, index) => (
            <motion.article className="product-card" key={p.id ?? p.uuid ?? p.nome} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 }} whileHover={{ y: -8, scale: 1.02 }}>
              <div className="product-image pistachio"><span>🍦</span><span className="product-label">Catálogo</span></div>
              <div className="product-info"><small>{p.categoria?.nome || p.categoria || p.sabor || "Sorvete"}</small><h4>{p.nome || p.name}</h4>
                <div className="product-bottom"><strong>{moeda(p.preco ?? p.preço ?? p.valor)}</strong>
                  <button aria-label={`Ver ${p.nome || p.name}`} onClick={() => onNavigate?.("Produtos")}><ArrowUpRight size={17} /></button>
                </div>
              </div>
            </motion.article>
          ))}
          {produtos.length === 0 && !carregando && <p>Nenhum produto cadastrado.</p>}
        </div>
      </section>

      <section className="promo-banner">
        <div><span>UMA EXPERIÊNCIA GELADINHA ❄️</span><h2>Deixe seu dia mais doce!</h2><p>{clientes.length} clientes cadastrados no sistema.</p></div>
        <div className="promo-emoji">🍧</div>
      </section>
    </motion.div>
  );
}
