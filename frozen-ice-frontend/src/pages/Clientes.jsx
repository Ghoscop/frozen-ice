import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, Plus, Pencil, Trash2, Users, X, Mail, Phone, MapPin,
  UserRound, RefreshCw
} from "lucide-react";
import {
  listarClientes,
  cadastrarCliente,
  atualizarCliente,
  excluirCliente as excluirClienteAPI,
} from "../services/clientesService";

const formularioVazio = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  endereco: "",
};

function mensagemErro(erro) {
  return erro?.response?.data?.message ||
    erro?.response?.data?.erro ||
    erro?.message ||
    "Não foi possível concluir a operação.";
}

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioVazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarClientes() {
    setCarregando(true);
    setErro("");
    try {
      const dados = await listarClientes();
      setClientes(dados);
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.toLocaleLowerCase("pt-BR").trim();
    if (!termo) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nome, cliente.cpf, cliente.telefone, cliente.email, cliente.endereco]
        .some((campo) => String(campo ?? "").toLocaleLowerCase("pt-BR").includes(termo))
    );
  }, [clientes, busca]);

  function abrirCadastro() {
    setClienteEditando(null);
    setFormulario(formularioVazio);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function abrirEdicao(cliente) {
    setClienteEditando(cliente);
    setFormulario({
      nome: cliente.nome ?? "",
      cpf: cliente.cpf ?? "",
      telefone: cliente.telefone ?? "",
      email: cliente.email ?? "",
      endereco: cliente.endereco ?? "",
    });
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarCliente(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    const cpfLimpo = formulario.cpf.replace(/\D/g, "");
    if (cpfLimpo && cpfLimpo.length !== 11) {
      setErro("Informe um CPF com 11 números.");
      return;
    }

    const cpfDuplicado = clientes.some((cliente) =>
      String(cliente.cpf ?? "").replace(/\D/g, "") === cpfLimpo &&
      cpfLimpo !== "" &&
      String(cliente.id) !== String(clienteEditando?.id)
    );
    if (cpfDuplicado) {
      setErro("Já existe um cliente cadastrado com esse CPF.");
      return;
    }

    setSalvando(true);
    try {
      if (clienteEditando) {
        await atualizarCliente(clienteEditando.id, formulario);
        setSucesso("Cliente atualizado com sucesso.");
      } else {
        await cadastrarCliente(formulario);
        setSucesso("Cliente cadastrado com sucesso.");
      }
      setModalAberto(false);
      setFormulario(formularioVazio);
      setClienteEditando(null);
      await carregarClientes();
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setSalvando(false);
    }
  }

  async function excluirCliente(id) {
    const cliente = clientes.find((item) => String(item.id) === String(id));
    if (!window.confirm(`Deseja realmente excluir ${cliente?.nome ?? "este cliente"}?`)) return;

    setErro("");
    setSucesso("");
    setExcluindoId(id);
    try {
      await excluirClienteAPI(id);
      setClientes((atuais) => atuais.filter((item) => String(item.id) !== String(id)));
      setSucesso("Cliente excluído com sucesso.");
    } catch (e) {
      setErro(mensagemErro(e));
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <main className="clients-page">
      <motion.div
        className="clients-heading"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="clients-eyebrow">RELACIONAMENTO FROZEN-ICE</span>
          <h1>Clientes <span>✦</span></h1>
          <p>Cadastre e acompanhe os clientes da sorveteria.</p>
        </div>
        <button className="clients-add-button" onClick={abrirCadastro}>
          <Plus size={18} /> Novo cliente
        </button>
      </motion.div>

      <section className="clients-summary">
        <div className="clients-summary-icon"><Users size={23} /></div>
        <div>
          <span>Clientes cadastrados</span>
          <strong>{clientes.length}</strong>
          <small>Registros carregados do servidor</small>
        </div>
      </section>

      {(erro || sucesso) && (
        <div role="alert" style={{
          padding: "12px 15px", borderRadius: 10,
          color: erro ? "#a33b59" : "#397a5b",
          background: erro ? "#fff0f3" : "#effaf3",
          border: `1px solid ${erro ? "#f4cbd5" : "#ccebd8"}`
        }}>
          {erro || sucesso}
        </div>
      )}

      <section className="clients-panel">
        <div className="clients-toolbar">
          <div>
            <h2>Cadastro de clientes</h2>
            <p>Pesquise, edite ou remova registros.</p>
          </div>
          <div className="clients-search">
            <Search size={18} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por nome, CPF ou contato..."
            />
          </div>
        </div>

        <div className="clients-table-wrap">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr><td colSpan="5" className="clients-empty">Carregando clientes...</td></tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="clients-empty">
                    {erro ? "Não foi possível carregar os clientes." : "Nenhum cliente encontrado."}
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {clientesFiltrados.map((cliente) => (
                    <motion.tr
                      key={cliente.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td>
                        <div className="client-name-cell">
                          <div className="client-avatar">
                            {(cliente.nome || "?").charAt(0).toUpperCase()}
                          </div>
                          <strong>{cliente.nome}</strong>
                        </div>
                      </td>
                      <td>
                        <div className="client-contact">
                          {cliente.email && <span><Mail size={14} /> {cliente.email}</span>}
                          {cliente.telefone && <span><Phone size={14} /> {cliente.telefone}</span>}
                          {!cliente.email && !cliente.telefone && "—"}
                        </div>
                      </td>
                      <td>{cliente.cpf || "—"}</td>
                      <td>
                        <span className="client-address">
                          <MapPin size={14} /> {cliente.endereco || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="client-actions">
                          <button className="client-edit" title="Editar" onClick={() => abrirEdicao(cliente)}>
                            <Pencil size={16} />
                          </button>
                          <button
                            className="client-delete"
                            title="Excluir"
                            disabled={excluindoId === cliente.id}
                            onClick={() => excluirCliente(cliente.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
        <div className="clients-footer">
          Exibindo {clientesFiltrados.length} de {clientes.length} clientes
          <button
            type="button"
            onClick={carregarClientes}
            style={{ float: "right", border: 0, background: "transparent", color: "#956bc0", cursor: "pointer" }}
          >
            <RefreshCw size={13} style={{ verticalAlign: "middle" }} /> Atualizar
          </button>
        </div>
      </section>

      <AnimatePresence>
        {modalAberto && (
          <motion.div
            className="clients-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !salvando) setModalAberto(false);
            }}
          >
            <motion.div
              className="clients-modal"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <div className="clients-modal-header">
                <div>
                  <span>FROZEN-ICE ✦</span>
                  <h2>{clienteEditando ? "Editar cliente" : "Novo cliente"}</h2>
                  <p>Informe os dados para cadastro.</p>
                </div>
                <button
                  className="clients-close"
                  type="button"
                  onClick={() => setModalAberto(false)}
                  disabled={salvando}
                  aria-label="Fechar"
                ><X size={20} /></button>
              </div>

              <form onSubmit={salvarCliente}>
                <div className="clients-form-grid">
                  <label className="clients-field clients-field-full">
                    Nome completo
                    <input name="nome" value={formulario.nome} onChange={atualizarCampo}
                      placeholder="Nome do cliente" required maxLength={120} />
                  </label>
                  <label className="clients-field">
                    CPF
                    <input name="cpf" value={formulario.cpf} onChange={atualizarCampo}
                      placeholder="000.000.000-00" inputMode="numeric" maxLength={14} />
                  </label>
                  <label className="clients-field">
                    Telefone
                    <input name="telefone" value={formulario.telefone} onChange={atualizarCampo}
                      placeholder="(00) 00000-0000" maxLength={20} />
                  </label>
                  <label className="clients-field clients-field-full">
                    E-mail
                    <input type="email" name="email" value={formulario.email} onChange={atualizarCampo}
                      placeholder="cliente@email.com" maxLength={160} />
                  </label>
                  <label className="clients-field clients-field-full">
                    Endereço
                    <input name="endereco" value={formulario.endereco} onChange={atualizarCampo}
                      placeholder="Rua, número, bairro e cidade" maxLength={240} />
                  </label>
                </div>

                {erro && (
                  <p role="alert" style={{ color: "#b34d68", fontSize: 12, marginTop: 14 }}>{erro}</p>
                )}

                <div className="clients-modal-actions">
                  <button type="button" className="clients-cancel"
                    onClick={() => setModalAberto(false)} disabled={salvando}>Cancelar</button>
                  <button type="submit" className="clients-save" disabled={salvando}>
                    {salvando ? "Salvando..." : clienteEditando ? "Salvar alterações" : "Cadastrar cliente"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
