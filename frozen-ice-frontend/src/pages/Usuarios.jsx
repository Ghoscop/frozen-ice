
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
} from "lucide-react";

const usuariosIniciais = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@frozenice.com",
    senha: "admin123",
    perfil: "Administrador",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Ana Souza",
    email: "ana@frozenice.com",
    senha: "ana12345",
    perfil: "Atendente",
    status: "Ativo",
  },
  {
    id: 3,
    nome: "Lucas Mendes",
    email: "lucas@frozenice.com",
    senha: "lucas123",
    perfil: "Atendente",
    status: "Inativo",
  },
];

const formularioVazio = {
  nome: "",
  email: "",
  senha: "",
  perfil: "Atendente",
  status: "Ativo",
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciais);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioVazio);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return usuarios.filter((usuario) =>
      [usuario.nome, usuario.email, usuario.perfil, usuario.status]
        .some((campo) => campo.toLowerCase().includes(termo))
    );
  }, [usuarios, busca]);

  const ativos = usuarios.filter((usuario) => usuario.status === "Ativo").length;
  const administradores = usuarios.filter(
    (usuario) => usuario.perfil === "Administrador"
  ).length;

  function abrirCadastro() {
    setUsuarioEditando(null);
    setFormulario(formularioVazio);
    setMostrarSenha(false);
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setUsuarioEditando(usuario);
    setFormulario({
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha,
      perfil: usuario.perfil,
      status: usuario.status,
    });
    setMostrarSenha(false);
    setModalAberto(true);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  function salvarUsuario(event) {
    event.preventDefault();

    const emailExiste = usuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() === formulario.email.toLowerCase() &&
        usuario.id !== usuarioEditando?.id
    );

    if (emailExiste) {
      alert("Já existe um usuário cadastrado com esse e-mail.");
      return;
    }

    if (usuarioEditando) {
      setUsuarios((atuais) =>
        atuais.map((usuario) =>
          usuario.id === usuarioEditando.id
            ? { ...usuario, ...formulario }
            : usuario
        )
      );
    } else {
      setUsuarios((atuais) => [
        { id: Date.now(), ...formulario },
        ...atuais,
      ]);
    }

    setModalAberto(false);
    setFormulario(formularioVazio);
    setUsuarioEditando(null);
  }

  function excluirUsuario(id) {
    const usuario = usuarios.find((item) => item.id === id);

    if (usuario?.perfil === "Administrador" && administradores === 1) {
      alert("Não é possível excluir o último administrador.");
      return;
    }

    if (window.confirm("Deseja realmente excluir este usuário?")) {
      setUsuarios((atuais) =>
        atuais.filter((usuario) => usuario.id !== id)
      );
    }
  }

  function alternarStatus(id) {
    setUsuarios((atuais) =>
      atuais.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              status: usuario.status === "Ativo" ? "Inativo" : "Ativo",
            }
          : usuario
      )
    );
  }

  return (
    <main className="users-page">
      <motion.div
        className="users-heading"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <span className="users-eyebrow">EQUIPE FROZEN-ICE</span>
          <h1>Usuários <span>✦</span></h1>
          <p>Gerencie quem tem acesso ao sistema.</p>
        </div>

        <button className="users-add-button" onClick={abrirCadastro}>
          <Plus size={19} />
          Novo usuário
        </button>
      </motion.div>

      <section className="users-stats">
        <div className="users-stat-card">
          <div className="users-stat-icon purple"><Users size={22} /></div>
          <div>
            <span>Total de usuários</span>
            <strong>{usuarios.length}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon pink"><ShieldCheck size={22} /></div>
          <div>
            <span>Usuários ativos</span>
            <strong>{ativos}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon blue"><UserRound size={22} /></div>
          <div>
            <span>Administradores</span>
            <strong>{administradores}</strong>
          </div>
        </div>
      </section>

      <section className="users-panel">
        <div className="users-toolbar">
          <div>
            <h2>Equipe cadastrada</h2>
            <p>Consulte e gerencie os acessos.</p>
          </div>

          <div className="users-search">
            <Search size={18} />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar usuário..."
            />
          </div>
        </div>

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Acesso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {usuariosFiltrados.map((usuario) => (
                  <motion.tr
                    key={usuario.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div className="users-person">
                        <div className="users-avatar">
                          {usuario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{usuario.nome}</strong>
                          <small>{usuario.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`users-role ${usuario.perfil === "Administrador" ? "admin" : "attendant"}`}>
                        {usuario.perfil}
                      </span>
                    </td>
                    <td>
                      <span className={`users-status ${usuario.status.toLowerCase()}`}>
                        {usuario.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="users-toggle"
                        onClick={() => alternarStatus(usuario.id)}
                      >
                        {usuario.status === "Ativo" ? "Desativar" : "Ativar"}
                      </button>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button
                          className="users-edit"
                          title="Editar"
                          onClick={() => abrirEdicao(usuario)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="users-delete"
                          title="Excluir"
                          onClick={() => excluirUsuario(usuario.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="users-empty">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="users-footer">
          Exibindo {usuariosFiltrados.length} de {usuarios.length} usuários
        </div>
      </section>

      <AnimatePresence>
        {modalAberto && (
          <motion.div
            className="users-modal-overlay"
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
              className="users-modal"
              initial={{ opacity: 0, y: 25, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="users-modal-header">
                <div>
                  <span>FROZEN-ICE ✦</span>
                  <h2>{usuarioEditando ? "Editar usuário" : "Novo usuário"}</h2>
                  <p>Preencha os dados de acesso.</p>
                </div>
                <button
                  className="users-close"
                  type="button"
                  onClick={() => setModalAberto(false)}
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={salvarUsuario}>
                <div className="users-form-grid">
                  <label className="users-field users-field-full">
                    Nome completo
                    <input
                      name="nome"
                      value={formulario.nome}
                      onChange={atualizarCampo}
                      placeholder="Digite o nome"
                      required
                    />
                  </label>

                  <label className="users-field users-field-full">
                    E-mail de acesso
                    <input
                      type="email"
                      name="email"
                      value={formulario.email}
                      onChange={atualizarCampo}
                      placeholder="nome@frozenice.com"
                      required
                    />
                  </label>

                  <label className="users-field users-field-full">
                    Senha
                    <div className="users-password">
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        name="senha"
                        value={formulario.senha}
                        onChange={atualizarCampo}
                        placeholder="Digite uma senha"
                        minLength="6"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha((atual) => !atual)}
                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>

                  <label className="users-field">
                    Perfil
                    <select
                      name="perfil"
                      value={formulario.perfil}
                      onChange={atualizarCampo}
                    >
                      <option>Atendente</option>
                      <option>Administrador</option>
                    </select>
                  </label>

                  <label className="users-field">
                    Status
                    <select
                      name="status"
                      value={formulario.status}
                      onChange={atualizarCampo}
                    >
                      <option>Ativo</option>
                      <option>Inativo</option>
                    </select>
                  </label>
                </div>

                <div className="users-modal-actions">
                  <button
                    type="button"
                    className="users-cancel"
                    onClick={() => setModalAberto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="users-save">
                    {usuarioEditando ? "Salvar alterações" : "Cadastrar usuário"}
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
