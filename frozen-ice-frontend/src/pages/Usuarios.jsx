import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import {
  listarUsuarios,
  cadastrarUsuario,
  atualizarUsuario,
  excluirUsuario as excluirUsuarioAPI,
} from "../services/usuariosService";

const formularioVazio = {
  nome: "",
  email: "",
  senha: "",
};

function mensagemErro(error, padrao) {
  return (
    error.response?.data?.message ||
    error.response?.data?.mensagem ||
    error.message ||
    padrao
  );
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioVazio);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      setErro("");
      const dados = await listarUsuarios();
      setUsuarios(dados);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setErro(
        mensagemErro(
          error,
          "Não foi possível carregar os usuários. Verifique se a API está disponível."
        )
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return usuarios;

    return usuarios.filter((usuario) =>
      [usuario.nome, usuario.email, usuario.perfil, usuario.status]
        .filter(Boolean)
        .some((campo) => String(campo).toLowerCase().includes(termo))
    );
  }, [usuarios, busca]);

  const administradores = usuarios.filter((usuario) => {
    const perfil = String(usuario.perfil || usuario.role || "").toLowerCase();
    return perfil.includes("admin");
  }).length;

  function abrirCadastro() {
    setUsuarioEditando(null);
    setFormulario(formularioVazio);
    setMostrarSenha(false);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function abrirEdicao(usuario) {
    setUsuarioEditando(usuario);
    setFormulario({
      nome: usuario.nome || "",
      email: usuario.email || "",
      // Nunca preencher a senha com dados vindos da API.
      senha: "",
    });
    setMostrarSenha(false);
    setErro("");
    setSucesso("");
    setModalAberto(true);
  }

  function atualizarCampo(event) {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  }

  async function salvarUsuario(event) {
    event.preventDefault();
    setErro("");
    setSucesso("");

    const nome = formulario.nome.trim();
    const email = formulario.email.trim().toLowerCase();

    if (!nome || !email) {
      setErro("Preencha o nome e o e-mail.");
      return;
    }

    if (!usuarioEditando && !formulario.senha.trim()) {
      setErro("Informe uma senha para o novo usuário.");
      return;
    }

    if (formulario.senha && formulario.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const emailExiste = usuarios.some(
      (usuario) =>
        String(usuario.email).toLowerCase() === email &&
        String(usuario.id) !== String(usuarioEditando?.id)
    );

    if (emailExiste) {
      setErro("Já existe um usuário cadastrado com esse e-mail.");
      return;
    }

    try {
      setSalvando(true);

      if (usuarioEditando) {
        await atualizarUsuario(usuarioEditando.id, {
          nome,
          email,
          senha: formulario.senha,
        });
      } else {
        await cadastrarUsuario({
          nome,
          email,
          senha: formulario.senha,
        });
      }

      setModalAberto(false);
      setFormulario(formularioVazio);
      setUsuarioEditando(null);
      setSucesso(
        usuarioEditando
          ? "Usuário atualizado com sucesso."
          : "Usuário cadastrado com sucesso."
      );
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      setErro(
        mensagemErro(
          error,
          "Não foi possível salvar o usuário. Confira os dados e a API."
        )
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluirUsuario(usuario) {
    const identificador = usuario.id;

    if (!identificador) {
      setErro("Este usuário não possui um identificador válido.");
      return;
    }

    if (
      !window.confirm(
        `Deseja realmente excluir o usuário ${usuario.nome || usuario.email}?`
      )
    ) {
      return;
    }

    try {
      setExcluindoId(identificador);
      setErro("");
      setSucesso("");
      await excluirUsuarioAPI(identificador);
      setSucesso("Usuário excluído com sucesso.");
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      setErro(mensagemErro(error, "Não foi possível excluir o usuário."));
    } finally {
      setExcluindoId(null);
    }
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
            <span>Administradores identificados</span>
            <strong>{administradores}</strong>
          </div>
        </div>

        <div className="users-stat-card">
          <div className="users-stat-icon blue"><UserRound size={22} /></div>
          <div>
            <span>Resultado da busca</span>
            <strong>{usuariosFiltrados.length}</strong>
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
              aria-label="Buscar usuário"
            />
          </div>
        </div>

        {erro && !modalAberto && (
          <div className="users-feedback users-feedback-error" role="alert">
            {erro}
            <button type="button" onClick={carregarUsuarios}>
              <RefreshCw size={15} /> Tentar novamente
            </button>
          </div>
        )}

        {sucesso && (
          <div className="users-feedback users-feedback-success" role="status">
            {sucesso}
          </div>
        )}

        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="4" className="users-empty">Carregando usuários...</td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="users-empty">
                    {erro ? "Não foi possível carregar a lista." : "Nenhum usuário encontrado."}
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {usuariosFiltrados.map((usuario) => {
                    const perfil = usuario.perfil || usuario.role || "Não informado";
                    const perfilAdmin = String(perfil).toLowerCase().includes("admin");

                    return (
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
                              {(usuario.nome || usuario.email || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{usuario.nome || "Sem nome"}</strong>
                              <small>{usuario.email || "Sem e-mail"}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`users-role ${perfilAdmin ? "admin" : "attendant"}`}>
                            {perfil}
                          </span>
                        </td>
                        <td>
                          <span className="users-status">
                            {usuario.dataCadastro
                              ? new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")
                              : "—"}
                          </span>
                        </td>
                        <td>
                          <div className="users-actions">
                            <button
                              className="users-edit"
                              title="Editar"
                              aria-label={`Editar ${usuario.nome || "usuário"}`}
                              onClick={() => abrirEdicao(usuario)}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="users-delete"
                              title="Excluir"
                              aria-label={`Excluir ${usuario.nome || "usuário"}`}
                              disabled={String(excluindoId) === String(usuario.id)}
                              onClick={() => excluirUsuario(usuario)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
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
              if (event.target === event.currentTarget && !salvando) {
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
                  disabled={salvando}
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
                      autoComplete="name"
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
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label className="users-field users-field-full">
                    {usuarioEditando ? "Nova senha (opcional)" : "Senha"}
                    <div className="users-password">
                      <input
                        type={mostrarSenha ? "text" : "password"}
                        name="senha"
                        value={formulario.senha}
                        onChange={atualizarCampo}
                        placeholder={usuarioEditando ? "Deixe em branco para manter" : "Crie uma senha"}
                        autoComplete={usuarioEditando ? "new-password" : "new-password"}
                        minLength="6"
                        required={!usuarioEditando}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha((atual) => !atual)}
                        aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <small>
                      A senha deve ser protegida com hash pelo back-end antes de ser armazenada.
                    </small>
                  </label>
                </div>

                {erro && (
                  <div className="users-feedback users-feedback-error" role="alert">
                    {erro}
                  </div>
                )}

                <div className="users-modal-actions">
                  <button
                    type="button"
                    className="users-cancel"
                    onClick={() => setModalAberto(false)}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="users-save" disabled={salvando}>
                    {salvando
                      ? "Salvando..."
                      : usuarioEditando
                        ? "Salvar alterações"
                        : "Cadastrar usuário"}
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