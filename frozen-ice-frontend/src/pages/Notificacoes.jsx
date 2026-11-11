
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Package,
  ShoppingBag,
  Users,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
  Filter
} from "lucide-react";

const notificacoesIniciais = [
  {
    id: 1,
    tipo: "estoque",
    titulo: "Estoque baixo",
    mensagem: "O produto Pistache Premium está com apenas 3 unidades.",
    horario: "Há 10 minutos",
    lida: false
  },
  {
    id: 2,
    tipo: "venda",
    titulo: "Nova venda realizada!",
    mensagem: "Uma venda foi finalizada com sucesso no caixa.",
    horario: "Há 35 minutos",
    lida: false
  },
  {
    id: 3,
    tipo: "cliente",
    titulo: "Novo cliente cadastrado",
    mensagem: "Um novo cliente foi adicionado ao sistema.",
    horario: "Há 2 horas",
    lida: false
  },
  {
    id: 4,
    tipo: "estoque",
    titulo: "Reposição necessária",
    mensagem: "O estoque de Morango Cremoso está abaixo do recomendado.",
    horario: "Ontem",
    lida: true
  },
  {
    id: 5,
    tipo: "venda",
    titulo: "Venda concluída",
    mensagem: "Uma venda foi registrada no sistema.",
    horario: "Ontem",
    lida: true
  }
];

const configuracaoTipos = {
  estoque: {
    icone: Package,
    classe: "notification-icon-stock",
    etiqueta: "Estoque"
  },
  venda: {
    icone: ShoppingBag,
    classe: "notification-icon-sale",
    etiqueta: "Venda"
  },
  cliente: {
    icone: Users,
    classe: "notification-icon-client",
    etiqueta: "Cliente"
  }
};

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState(
    notificacoesIniciais
  );
  const [filtro, setFiltro] = useState("todas");

  const naoLidas = notificacoes.filter(
    (notificacao) => !notificacao.lida
  ).length;

  const notificacoesFiltradas = notificacoes.filter(
    (notificacao) =>
      filtro === "todas" ||
      (filtro === "naoLidas" && !notificacao.lida)
  );

  function marcarComoLida(id) {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) =>
        notificacao.id === id
          ? { ...notificacao, lida: true }
          : notificacao
      )
    );
  }

  function marcarTodasComoLidas() {
    setNotificacoes((atuais) =>
      atuais.map((notificacao) => ({
        ...notificacao,
        lida: true
      }))
    );
  }

  function excluirNotificacao(id) {
    setNotificacoes((atuais) =>
      atuais.filter((notificacao) => notificacao.id !== id)
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-heading">
        <div>
          <span className="notifications-eyebrow">
            <Sparkles size={15} /> FIQUE POR DENTRO
          </span>
          <h1>Notificações</h1>
          <p>Acompanhe os avisos e novidades da sua sorveteria.</p>
        </div>

        <div className="notifications-heading-icon">
          <Bell size={28} />
          {naoLidas > 0 && (
            <span>{naoLidas}</span>
          )}
        </div>
      </div>

      <div className="notification-summary">
        <div className="notification-summary-icon">
          <Bell size={22} />
        </div>
        <div>
          <strong>{naoLidas} notificações não lidas</strong>
          <p>Você está atualizado com as atividades da loja.</p>
        </div>
      </div>

      <section className="notifications-panel">
        <div className="notifications-toolbar">
          <div className="notification-filters">
            <button
              className={filtro === "todas" ? "selected" : ""}
              onClick={() => setFiltro("todas")}
            >
              Todas
            </button>

            <button
              className={filtro === "naoLidas" ? "selected" : ""}
              onClick={() => setFiltro("naoLidas")}
            >
              Não lidas ({naoLidas})
            </button>
          </div>

          <button
            className="mark-all-button"
            onClick={marcarTodasComoLidas}
            disabled={naoLidas === 0}
          >
            <CheckCheck size={17} />
            Marcar todas como lidas
          </button>
        </div>

        <div className="notification-list">
          <AnimatePresence mode="popLayout">
            {notificacoesFiltradas.map((notificacao) => {
              const tipo = configuracaoTipos[notificacao.tipo];
              const Icone = tipo.icone;

              return (
                <motion.article
                  layout
                  key={notificacao.id}
                  className={`notification-item ${
                    !notificacao.lida ? "unread" : ""
                  }`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                >
                  <div className={`notification-item-icon ${tipo.classe}`}>
                    <Icone size={21} />
                  </div>

                  <div className="notification-content">
                    <div className="notification-title-row">
                      <strong>{notificacao.titulo}</strong>
                      {!notificacao.lida && (
                        <span className="notification-unread-dot" />
                      )}
                    </div>

                    <p>{notificacao.mensagem}</p>

                    <div className="notification-meta">
                      <span>{tipo.etiqueta}</span>
                      <span>{notificacao.horario}</span>
                    </div>
                  </div>

                  <div className="notification-actions">
                    {!notificacao.lida && (
                      <button
                        title="Marcar como lida"
                        aria-label="Marcar como lida"
                        onClick={() => marcarComoLida(notificacao.id)}
                      >
                        <Check size={18} />
                      </button>
                    )}

                    <button
                      title="Excluir notificação"
                      aria-label="Excluir notificação"
                      onClick={() => excluirNotificacao(notificacao.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {notificacoesFiltradas.length === 0 && (
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
