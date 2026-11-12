import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CalendarDays, Eye, X, ShoppingBag, TrendingUp,
  DollarSign, Receipt, CreditCard, RefreshCw, AlertCircle
} from "lucide-react";
import { listarVendas } from "../services/vendasService";

const dinheiro = valor => Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataFormatada = data => {
  if (!data) return "—";
  const d = new Date(data.length === 10 ? `${data}T12:00:00` : data);
  return Number.isNaN(d.getTime()) ? data : d.toLocaleDateString("pt-BR");
};
const normalizar = v => {
  const itensOriginais = v.itens ?? v.produtos ?? v.itensVenda ?? [];
  const itens = itensOriginais.map(i => ({
    nome: i.nome ?? i.produto?.nome ?? i.produtoNome ?? "Produto",
    quantidade: Number(i.quantidade ?? i.qtd ?? 1),
    preco: Number(i.precoUnitario ?? i.preco ?? i.produto?.preco ?? i.produto?.preço ?? 0)
  }));
  const dataValor = v.dataHora ?? v.data ?? v.dataVenda ?? v.createdAt;
  const dt = dataValor ? new Date(dataValor) : null;
  return {
    id: v.id ?? v.codigo,
    cliente: v.cliente?.nome ?? v.nomeCliente ?? v.clienteNome ?? "Cliente não informado",
    data: typeof dataValor === "string" ? dataValor.slice(0, 10) : "",
    hora: dt && !Number.isNaN(dt.getTime()) ? dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : (v.hora ?? ""),
    pagamento: v.formaPagamento ?? v.pagamento ?? "—",
    status: v.status ?? "Concluída",
    itens,
    totalInformado: Number(v.valorTotal ?? v.total ?? 0)
  };
};
const totalVenda = venda => venda.totalInformado || venda.itens.reduce((s, i) => s + i.preco * i.quantidade, 0);

export default function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroData, setFiltroData] = useState("");
  const [vendaSelecionada, setVendaSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarVendas() {
    setCarregando(true); setErro("");
    try {
      const dados = await listarVendas();
      setVendas((Array.isArray(dados) ? dados : []).map(normalizar));
    } catch (e) {
      setErro(e?.response?.data?.message || e?.response?.data?.mensagem || "Não foi possível carregar o histórico de vendas.");
    } finally { setCarregando(false); }
  }
  useEffect(() => { carregarVendas(); }, []);

  const filtradas = useMemo(() => vendas.filter(v => {
    const termo = busca.toLowerCase();
    const buscaOk = String(v.id).includes(termo) || v.cliente.toLowerCase().includes(termo) || v.pagamento.toLowerCase().includes(termo);
    const statusOk = filtroStatus === "Todos" || v.status.toLowerCase() === filtroStatus.toLowerCase();
    const dataOk = !filtroData || v.data === filtroData;
    return buscaOk && statusOk && dataOk;
  }), [vendas, busca, filtroStatus, filtroData]);

  const concluidas = vendas.filter(v => ["concluída", "concluida", "finalizada"].includes(v.status.toLowerCase()));
  const faturamento = concluidas.reduce((s, v) => s + totalVenda(v), 0);
  const quantidadeItens = concluidas.reduce((s, v) => s + v.itens.reduce((n, i) => n + i.quantidade, 0), 0);

  return <motion.div className="history-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <div className="history-heading"><div><span className="history-eyebrow">FROZEN-ICE • GESTÃO</span><h1>Histórico de vendas 🍦</h1><p>Acompanhe os pedidos reais registrados no sistema.</p></div>
      <button className="history-refresh" onClick={carregarVendas} disabled={carregando}><RefreshCw size={16}/> Atualizar</button>
    </div>
    {erro && <div className="sale-api-message error"><AlertCircle size={17}/>{erro}</div>}
    <div className="history-stats">
      <div className="history-stat"><div className="history-stat-icon purple"><Receipt size={21}/></div><div><span>Vendas registradas</span><strong>{vendas.length}</strong></div></div>
      <div className="history-stat"><div className="history-stat-icon pink"><DollarSign size={21}/></div><div><span>Faturamento concluído</span><strong>{dinheiro(faturamento)}</strong></div></div>
      <div className="history-stat"><div className="history-stat-icon blue"><ShoppingBag size={21}/></div><div><span>Itens vendidos</span><strong>{quantidadeItens}</strong></div></div>
      <div className="history-stat"><div className="history-stat-icon green"><TrendingUp size={21}/></div><div><span>Vendas concluídas</span><strong>{concluidas.length}</strong></div></div>
    </div>
    <section className="history-panel">
      <div className="history-panel-heading"><div><h2>Pedidos realizados</h2><p>Consulte e acompanhe as movimentações.</p></div><span className="history-count">{filtradas.length} registros</span></div>
      <div className="history-filters">
        <div className="history-search"><Search size={18}/><input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por pedido, cliente ou pagamento..."/></div>
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}><option value="Todos">Todos os status</option><option value="Concluída">Concluídas</option><option value="Cancelada">Canceladas</option></select>
        <div className="history-date-filter"><CalendarDays size={17}/><input type="date" value={filtroData} onChange={e => setFiltroData(e.target.value)}/></div>
        <button className="history-clear" onClick={() => {setBusca("");setFiltroStatus("Todos");setFiltroData("");}}>Limpar</button>
      </div>
      <div className="history-table-wrapper"><table className="history-table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data e hora</th><th>Pagamento</th><th>Total</th><th>Status</th><th>Detalhes</th></tr></thead>
        <tbody>{filtradas.map(v => <tr key={v.id}><td className="history-order">#{v.id}</td><td>{v.cliente}</td><td><strong>{dataFormatada(v.data)}</strong><small className="history-time">{v.hora}</small></td><td><span className="history-payment"><CreditCard size={15}/>{v.pagamento}</span></td><td className="history-value">{dinheiro(totalVenda(v))}</td><td><span className={`history-status ${["concluída","concluida","finalizada"].includes(v.status.toLowerCase()) ? "completed" : "cancelled"}`}>{v.status}</span></td><td><button className="history-view" onClick={() => setVendaSelecionada(v)} aria-label={`Ver pedido ${v.id}`}><Eye size={17}/></button></td></tr>)}</tbody>
      </table>
      {carregando && <div className="history-no-results">Carregando vendas...</div>}
      {!carregando && filtradas.length === 0 && <div className="history-no-results"><span>🔎</span><strong>Nenhuma venda encontrada</strong><p>Não há registros para os filtros selecionados.</p></div>}
      </div>
    </section>
    <AnimatePresence>{vendaSelecionada && <motion.div className="history-modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setVendaSelecionada(null)}>
      <motion.div className="history-modal" initial={{opacity:0,scale:.94,y:15}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.94}} onClick={e => e.stopPropagation()}>
        <div className="history-modal-heading"><div><span>DETALHES DO PEDIDO</span><h2>Pedido #{vendaSelecionada.id}</h2></div><button onClick={() => setVendaSelecionada(null)}><X size={20}/></button></div>
        <div className="history-detail-info"><p><strong>Cliente:</strong> {vendaSelecionada.cliente}</p><p><strong>Data:</strong> {dataFormatada(vendaSelecionada.data)} às {vendaSelecionada.hora}</p><p><strong>Pagamento:</strong> {vendaSelecionada.pagamento}</p><p><strong>Status:</strong> {vendaSelecionada.status}</p></div>
        <h3 className="history-items-title">Itens do pedido</h3>
        {vendaSelecionada.itens.map((i,n) => <div className="history-detail-item" key={n}><div><strong>{i.nome}</strong><span>{i.quantidade} × {dinheiro(i.preco)}</span></div><strong>{dinheiro(i.quantidade*i.preco)}</strong></div>)}
        <div className="history-detail-total"><span>Total do pedido</span><strong>{dinheiro(totalVenda(vendaSelecionada))}</strong></div>
        <button className="history-close-button" onClick={() => setVendaSelecionada(null)}>Fechar detalhes</button>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </motion.div>;
}
