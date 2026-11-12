import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Package, ShoppingBag, Users, Check, CheckCheck,
  Trash2, Sparkles, RefreshCw
} from "lucide-react";
import {
  listarNotificacoes,
  marcarNotificacaoComoLida,
  marcarTodasNotificacoesComoLidas,
  excluirNotificacao
} from "../services/notificacoesService";

const configuracaoTipos = {
  estoque: { icone: Package, classe: "notification-icon-stock", etiqueta: "Estoque" },
  venda: { icone: ShoppingBag, classe: "notification-icon-sale", etiqueta: "Venda" },
  cliente: { icone: Users, classe: "notification-icon-client", etiqueta: "Cliente" }
};

function normalizarNotificacao(item) {
  const data = item.dataHora || item.createdAt || item.dataCadastro || item.data || null;
  const tipoOriginal = String(item.tipo || item.categoria || "venda").toLowerCase();
  const tipo = tipoOriginal.includes("estoq") ? "estoque"
    : tipoOriginal.includes("client") ? "cliente" : "venda";
  let horario = item.horario || item.tempo || "";
  if (!horario && data) {
    const parsed = new Date(data);
    horario = Number.isNaN(parsed.getTime())
      ? String(data)
      : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  }
  return {
    ...item,
    id: item.id ?? item.uuid,
    tipo,
    titulo: item.titulo || item.title || "Notificação",
    mensagem: item.mensagem || item.message || item.descricao || "",
    horario: horario || "Data não informada",
    lida: Boolean(item.lida ?? item.lidaEm ?? item.read ?? false)
  };
}

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [acaoEmCurso, setAcaoEmCurso] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarNotificacoes();
      const lista = Array.isArray(dados) ? dados : (dados?.content || dados?.notificacoes || []);
      setNotificacoes(lista.map(normalizarNotificacao));
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.mensagem ||
        "Não foi possível carregar as notificações. Verifique a conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const naoLidas = useMemo(
    () => notificacoes.filter((n) => !n.lida).length,
    [notificacoes]
  );
  const filtradas = useMemo(
    () => notificacoes.filter((n) => filtro === "todas" || !n.lida),
    [notificacoes, filtro]
  );

  async function marcarComoLida(id) {
    setAcaoEmCurso(id);
    setErro("");
    try {
      await marcarNotificacaoComoLida(id);
      setNotificacoes((atuais) => atuais.map((n) => n.id === id ? { ...n, lida: true } : n));
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível atualizar a notificação.");
    } finally { setAcaoEmCurso(null); }
  }

  async function marcarTodasComoLidas() {
    setAcaoEmCurso("todas");
    setErro("");
    try {
      await marcarTodasNotificacoesComoLidas();
      setNotificacoes((atuais) => atuais.map((n) => ({ ...n, lida: true })));
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível atualizar as notificações.");
    } finally { setAcaoEmCurso(null); }
  }

  async function remover(id) {
    setAcaoEmCurso(id);
    setErro("");
    try {
      await excluirNotificacao(id);
      setNotificacoes((atuais) => atuais.filter((n) => n.id !== id));
    } catch (error) {
      setErro(error.response?.data?.message || "Não foi possível excluir a notificação.");
    } finally { setAcaoEmCurso(null); }
  }

  return (
    <div className="notifications-page">
      <div className="notifications-heading">
        <div>
          <span className="notifications-eyebrow"><Sparkles size={15} /> FIQUE POR DENTRO</span>
          <h1>Notificações</h1>
          <p>Acompanhe os avisos e novidades da sua sorveteria.</p>
        </div>
        <div className="notifications-heading-icon">
          <Bell size={28} />
          {naoLidas > 0 && <span>{naoLidas}</span>}
        </div>
      </div>

      <div className="notification-summary">
        <div className="notification-summary-icon"><Bell size={22} /></div>
        <div>
          <strong>{naoLidas} notificações não lidas</strong>
          <p>Você está atualizado com as atividades da loja.</p>
        </div>
      </div>

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="notification-filters">
            <button className={filtro === "todas" ? "selected" : ""} onClick={() => setFiltro("todas")}>Todas</button>
            <button className={filtro === "naoLidas" ? "selected" : ""} onClick={() => setFiltro("naoLidas")}>Não lidas ({naoLidas})</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="mark-all-button" onClick={carregar} disabled={carregando}>
              <RefreshCw size={16} /> Atualizar
            </button>
            <button className="mark-all-button" onClick={marcarTodasComoLidas} disabled={naoLidas === 0 || acaoEmCurso !== null}>
              <CheckCheck size={17} /> Marcar todas como lidas
            </button>
          </div>
        </div>

        {erro && <p role="alert" className="notification-api-error">{erro}</p>}
        <div className="notification-list">
          {carregando ? (
            <div className="notifications-empty">Carregando notificações...</div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtradas.map((notificacao) => {
                const tipo = configuracaoTipos[notificacao.tipo] || configuracaoTipos.venda;
                const Icone = tipo.icone;
                return (
                  <motion.article layout key={notificacao.id}
                    className={`notification-item ${!notificacao.lida ? "unread" : ""}`}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}>
                    <div className={`notification-item-icon ${tipo.classe}`}><Icone size={21} /></div>
                    <div className="notification-content">
                      <div className="notification-title-row">
                        <strong>{notificacao.titulo}</strong>
                        {!notificacao.lida && <span className="notification-unread-dot" />}
                      </div>
                      <p>{notificacao.mensagem}</p>
                      <div className="notification-meta"><span>{tipo.etiqueta}</span><span>{notificacao.horario}</span></div>
                    </div>
                    <div className="notification-actions">
                      {!notificacao.lida && (
                        <button title="Marcar como lida" aria-label="Marcar como lida"
                          disabled={acaoEmCurso !== null} onClick={() => marcarComoLida(notificacao.id)}>
                          <Check size={18} />
                        </button>
                      )}
                      <button title="Excluir notificação" aria-label="Excluir notificação"
                        disabled={acaoEmCurso !== null} onClick={() => remover(notificacao.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          )}
          {!carregando && filtradas.length === 0 && (
            <div className="notifications-empty">
              <div><Bell size={30} /></div>
              <strong>Nenhuma notificação por aqui!</strong>
              <p>Quando houver novidades, elas aparecerão aqui.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
