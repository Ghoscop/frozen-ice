
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";

const clientesIniciais = [
  {
    id: 1,
    nome: "Mariana Oliveira",
    cpf: "123.456.789-00",
    telefone: "(62) 99999-1111",
    email: "mariana@email.com",
    endereco: "Setor Bueno, Goiânia - GO",
  },
  {
    id: 2,
    nome: "Lucas Ferreira",
    cpf: "234.567.890-11",
    telefone: "(62) 98888-2222",
    email: "lucas@email.com",
    endereco: "Setor Oeste, Goiânia - GO",
  },
  {
    id: 3,
    nome: "Ana Carolina",
    cpf: "345.678.901-22",
    telefone: "(62) 97777-3333",
    email: "ana@email.com",
    endereco: "Jardim América, Goiânia - GO",
  },
];

const formularioVazio = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  endereco: "",
};

export default function Clientes() {
  const [clientes, setClientes] = useState(clientesIniciais);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioVazio);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return clientes.filter((cliente) =>
      [cliente.nome, cliente.cpf, cliente.email, cliente.telefone]
        .some((campo) => campo.toLowerCase().includes(termo))
    );
  }, [clientes, busca]);

  function abrirCadastro() {
    setClienteEditando(null);
    setFormulario(formularioVazio);
    setModalAberto(true);
  }

  function abrirEdicao(cliente) {
    setClienteEditando(cliente);
    setFormulario({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco,
    });
    setModalAberto(true);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function salvarCliente(event) {
    event.preventDefault();

    const cpfExiste = clientes.some(
      (cliente) =>
        cliente.cpf === formulario.cpf &&
        cliente.id !== clienteEditando?.id
    );

    if (cpfExiste) {
      alert("Já existe um cliente cadastrado com esse CPF.");
      return;
    }

    if (clienteEditando) {
      setClientes((atuais) =>
        atuais.map((cliente) =>
          cliente.id === clienteEditando.id
            ? { ...cliente, ...formulario }
            : cliente
        )
      );
    } else {
      setClientes((atuais) => [
        {
          id: Date.now(),
          ...formulario,
        },
        ...atuais,
      ]);
    }

    setModalAberto(false);
    setFormulario(formularioVazio);
    setClienteEditando(null);
  }

  function excluirCliente(id) {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (confirmar) {
      setClientes((atuais) =>
        atuais.filter((cliente) => cliente.id !== id)
      );
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
          <span className="clients-eyebrow">RELACIONAMENTO</span>
          <h1>Clientes <span>♡</span></h1>
          <p>Cuide de quem deixa nossos dias mais doces.</p>
        </div>

        <button className="clients-add-button" onClick={abrirCadastro}>
          <Plus size={19} />
          Novo cliente
        </button>
      </motion.div>

      <section className="clients-summary">
        <div className="clients-summary-icon">
          <Users size={25} />
        </div>
        <div>
          <span>Total de clientes</span>
          <strong>{clientes.length}</strong>
          <small>Clientes cadastrados</small>
        </div>
      </section>

      <section className="clients-panel">
        <div className="clients-toolbar">
          <div>
            <h2>Nossa comunidade</h2>
            <p>Gerencie os clientes da sorveteria.</p>
          </div>

          <div className="clients-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou e-mail..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>
        </div>

        <div className="clients-table-wrap">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
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
                        {cliente.nome.charAt(0).toUpperCase()}
                      </div>
                      <strong>{cliente.nome}</strong>
                    </div>
                  </td>

                  <td>{cliente.cpf}</td>

                  <td>
                    <div className="client-contact">
                      <span><Phone size={14} /> {cliente.telefone}</span>
                      <span><Mail size={14} /> {cliente.email}</span>
                    </div>
                  </td>

                  <td>
                    <span className="client-address">
                      <MapPin size={14} />
                      {cliente.endereco}
                    </span>
                  </td>

                  <td>
                    <div className="client-actions">
                      <button
                        className="client-edit"
                        title="Editar cliente"
                        onClick={() => abrirEdicao(cliente)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        className="client-delete"
                        title="Excluir cliente"
                        onClick={() => excluirCliente(cliente.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="clients-empty">
                    Nenhum cliente encontrado. 🍦
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="clients-footer">
          Exibindo {clientesFiltrados.length} de {clientes.length} clientes
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
              if (event.target === event.currentTarget) {
                setModalAberto(false);
              }
            }}
          >
            <motion.div
              className="clients-modal"
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="clients-modal-header">
                <div>
                  <span>FROZEN-ICE ♡</span>
                  <h2>{clienteEditando ? "Editar cliente" : "Novo cliente"}</h2>
                  <p>Preencha os dados do cliente abaixo.</p>
                </div>
                <button
                  type="button"
                  className="clients-close"
                  onClick={() => setModalAberto(false)}
                  aria-label="Fechar"
                >
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={salvarCliente}>
                <div className="clients-form-grid">
                  <label className="clients-field clients-field-full">
                    Nome completo
                    <input
                      name="nome"
                      value={formulario.nome}
                      onChange={atualizarCampo}
                      placeholder="Digite o nome completo"
                      required
                    />
                  </label>

                  <label className="clients-field">
                    CPF
                    <input
                      name="cpf"
                      value={formulario.cpf}
                      onChange={atualizarCampo}
                      placeholder="000.000.000-00"
                      required
                    />
                  </label>

                  <label className="clients-field">
                    Telefone
                    <input
                      name="telefone"
                      value={formulario.telefone}
                      onChange={atualizarCampo}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </label>

                  <label className="clients-field clients-field-full">
                    E-mail
                    <input
                      type="email"
                      name="email"
                      value={formulario.email}
                      onChange={atualizarCampo}
                      placeholder="cliente@email.com"
                      required
                    />
                  </label>

                  <label className="clients-field clients-field-full">
                    Endereço
                    <input
                      name="endereco"
                      value={formulario.endereco}
                      onChange={atualizarCampo}
                      placeholder="Rua, número, bairro e cidade"
                      required
                    />
                  </label>
                </div>

                <div className="clients-modal-actions">
                  <button
                    type="button"
                    className="clients-cancel"
                    onClick={() => setModalAberto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="clients-save">
                    {clienteEditando ? "Salvar alterações" : "Cadastrar cliente"}
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
