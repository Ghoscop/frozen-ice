
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { listarVendas } from "../services/vendasService";
import {
  Search, CalendarDays, Eye, X, ShoppingBag,
  TrendingUp, DollarSign, Receipt, CreditCard
} from "lucide-react";

const vendasIniciais = [
  {
    id: 1001,
    cliente: "Mariana Costa",
    data: "2026-11-09",
    hora: "10:32",
    pagamento: "Pix",
    status: "Concluída",
    itens: [
      { nome: "Chocolate Belga", quantidade: 2, preco: 12 },
      { nome: "Morango Cremoso", quantidade: 1, preco: 10 }
    ]
  },
  {
    id: 1002,
    cliente: "Pedro Henrique",
    data: "2026-11-09",
    hora: "11:15",
    pagamento: "Cartão",
    status: "Concluída",
    itens: [
      { nome: "Pistache Premium", quantidade: 1, preco: 16 },
      { nome: "Cookies & Cream", quantidade: 2, preco: 14 }
    ]
  },
  {
    id: 1003,
    cliente: "Ana Clara",
    data: "2026-11-08",
    hora: "14:20",
    pagamento: "Dinheiro",
    status: "Concluída",
    itens: [
      { nome: "Açaí Tropical", quantidade: 2, preco: 13 }
    ]
  },
  {
    id: 1004,
    cliente: "Lucas Martins",
    data: "2026-11-08",
    hora: "16:45",
    pagamento: "Pix",
    status: "Cancelada",
    itens: [
      { nome: "Doce de Leite", quantidade: 1, preco: 11 }
    ]
  },
  {
    id: 1005,
    cliente: "Beatriz Souza",
    data: "2026-11-07",
    hora: "17:10",
    pagamento: "Cartão",
    status: "Concluída",
    itens: [
      { nome: "Morango Cremoso", quantidade: 2, preco: 10 },
      { nome: "Chocolate Belga", quantidade: 1, preco: 12 }
    ]
  }
];

const dinheiro = valor =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

const totalVenda = venda =>
  venda.itens.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

const dataFormatada = data =>
  new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR");

export default function HistoricoVendas() {
  const [vendas, setVendas] = useState([]);

useEffect(() => {
  const vendasSalvas = listarVendas();

  // Mantém os registros de demonstração quando ainda não há vendas reais.
  setVendas(
    vendasSalvas.length > 0 ? vendasSalvas : vendasIniciais
  );
}, []);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroData, setFiltroData] = useState("");
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const vendasFiltradas = useMemo(() => {
    return vendas.filter(venda => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        String(venda.id).includes(termo) ||
        venda.cliente.toLowerCase().includes(termo) ||
        venda.pagamento.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "Todos" || venda.status === filtroStatus;

      const correspondeData =
        !filtroData || venda.data === filtroData;

      return correspondeBusca && correspondeStatus && correspondeData;
    });
  }, [vendas, busca, filtroStatus, filtroData]);

  const vendasConcluidas = vendas.filter(
    venda => venda.status === "Concluída"
  );

  const faturamento = vendasConcluidas.reduce(
    (total, venda) => total + totalVenda(venda),
    0
  );

  const quantidadeItens = vendasConcluidas.reduce(
    (total, venda) =>
      total + venda.itens.reduce((soma, item) => soma + item.quantidade, 0),
    0
  );

  return (
    <motion.div
      className="history-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="history-heading">
        <div>
          <span className="history-eyebrow">FROZEN-ICE • GESTÃO</span>
          <h1>Histórico de vendas 🍦</h1>
          <p>Acompanhe os pedidos e confira os resultados da sorveteria.</p>
        </div>
      </div>

      <div className="history-stats">
        <div className="history-stat">
          <div className="history-stat-icon purple">
            <Receipt size={21} />
          </div>
          <div>
            <span>Vendas registradas</span>
            <strong>{vendas.length}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon pink">
            <DollarSign size={21} />
          </div>
          <div>
            <span>Faturamento concluído</span>
            <strong>{dinheiro(faturamento)}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon blue">
            <ShoppingBag size={21} />
          </div>
          <div>
            <span>Itens vendidos</span>
            <strong>{quantidadeItens}</strong>
          </div>
        </div>

        <div className="history-stat">
          <div className="history-stat-icon green">
            <TrendingUp size={21} />
          </div>
          <div>
            <span>Vendas concluídas</span>
            <strong>{vendasConcluidas.length}</strong>
          </div>
        </div>
      </div>

      <section className="history-panel">
        <div className="history-panel-heading">
          <div>
            <h2>Pedidos realizados</h2>
            <p>Consulte e acompanhe as movimentações.</p>
          </div>
          <span className="history-count">
            {vendasFiltradas.length} registros
          </span>
        </div>

        <div className="history-filters">
          <div className="history-search">
            <Search size={18} />
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar por pedido, cliente ou pagamento..."
            />
          </div>

          <select
            value={filtroStatus}
            onChange={e => setFiltroStatus(e.target.value)}
          >
            <option value="Todos">Todos os status</option>
            <option value="Concluída">Concluídas</option>
            <option value="Cancelada">Canceladas</option>
          </select>

          <div className="history-date-filter">
            <CalendarDays size={17} />
            <input
              type="date"
              value={filtroData}
              onChange={e => setFiltroData(e.target.value)}
            />
          </div>

          <button
            className="history-clear"
            onClick={() => {
              setBusca("");
              setFiltroStatus("Todos");
              setFiltroData("");
            }}
          >
            Limpar
          </button>
        </div>

        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data e hora</th>
                <th>Pagamento</th>
                <th>Total</th>
                <th>Status</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {vendasFiltradas.map(venda => (
                <tr key={venda.id}>
                  <td className="history-order">#{venda.id}</td>
                  <td>{venda.cliente}</td>
                  <td>
                    <strong>{dataFormatada(venda.data)}</strong>
                    <small className="history-time">{venda.hora}</small>
                  </td>
                  <td>
                    <span className="history-payment">
                      <CreditCard size={15} />
                      {venda.pagamento}
                    </span>
                  </td>
                  <td className="history-value">
                    {dinheiro(totalVenda(venda))}
                  </td>
                  <td>
                    <span className={`history-status ${
                      venda.status === "Concluída" ? "completed" : "cancelled"
                    }`}>
                      {venda.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="history-view"
                      onClick={() => setVendaSelecionada(venda)}
                      aria-label={`Ver pedido ${venda.id}`}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {vendasFiltradas.length === 0 && (
            <div className="history-no-results">
              <span>🔎</span>
              <strong>Nenhuma venda encontrada</strong>
              <p>Tente mudar os filtros ou a pesquisa.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {vendaSelecionada && (
          <motion.div
            className="history-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVendaSelecionada(null)}
          >
            <motion.div
              className="history-modal"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="history-modal-heading">
                <div>
                  <span>DETALHES DO PEDIDO</span>
                  <h2>Pedido #{vendaSelecionada.id}</h2>
                </div>
                <button onClick={() => setVendaSelecionada(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="history-detail-info">
                <p><strong>Cliente:</strong> {vendaSelecionada.cliente}</p>
                <p><strong>Data:</strong> {dataFormatada(vendaSelecionada.data)} às {vendaSelecionada.hora}</p>
                <p><strong>Pagamento:</strong> {vendaSelecionada.pagamento}</p>
                <p><strong>Status:</strong> {vendaSelecionada.status}</p>
              </div>

              <h3 className="history-items-title">Itens do pedido</h3>

              {vendaSelecionada.itens.map((item, index) => (
                <div className="history-detail-item" key={index}>
                  <div>
                    <strong>{item.nome}</strong>
                    <span>{item.quantidade} × {dinheiro(item.preco)}</span>
                  </div>
                  <strong>{dinheiro(item.quantidade * item.preco)}</strong>
                </div>
              ))}

              <div className="history-detail-total">
                <span>Total do pedido</span>
                <strong>{dinheiro(totalVenda(vendaSelecionada))}</strong>
              </div>

              <button
                className="history-close-button"
                onClick={() => setVendaSelecionada(null)}
              >
                Fechar detalhes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
