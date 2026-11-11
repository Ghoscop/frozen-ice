
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Store,
  User,
  Bell,
  Palette,
  Save,
  ImagePlus,
  Trash2
} from "lucide-react";

const CONFIG_KEY = "frozen_ice_configuracoes";

export default function Configuracoes({ usuario, onAtualizarUsuario }) {
  const [foto, setFoto] = useState(usuario?.avatar || "");
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [tema, setTema] = useState("claro");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    try {
      const salvas = JSON.parse(localStorage.getItem(CONFIG_KEY));

      if (salvas) {
        setTelefone(salvas.telefone || "");
        setEndereco(salvas.endereco || "");
        setNotificacoesAtivas(salvas.notificacoesAtivas ?? true);
        setTema(salvas.tema || "claro");
      }
    } catch {
      console.error("Não foi possível carregar as configurações.");
    }
  }, []);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione um arquivo de imagem válido.");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 3 * 1024 * 1024) {
      alert("Escolha uma imagem de até 3 MB.");
      event.target.value = "";
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  function salvarConfiguracoes(event) {
    event.preventDefault();

    const novasConfiguracoes = {
      telefone,
      endereco,
      notificacoesAtivas,
      tema
    };

    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(novasConfiguracoes));

      const usuarioAtualizado = {
        ...usuario,
        nome,
        email,
        avatar: foto
      };

      localStorage.setItem(
        "frozen_ice_perfil",
        JSON.stringify(usuarioAtualizado)
        );

        onAtualizarUsuario(usuarioAtualizado);
      setMensagem("Configurações salvas com sucesso!");
    } catch {
      setMensagem("Não foi possível salvar. Tente usar uma imagem menor.");
    }
  }

  return (
    <div className="settings-page">
      <div className="settings-heading">
        <div>
          <span className="settings-eyebrow">PERSONALIZE SEU SISTEMA</span>
          <h1>Configurações</h1>
          <p>Gerencie seu perfil e as preferências do FROZEN-ICE.</p>
        </div>
        <div className="settings-heading-icon">
          <Palette size={28} />
        </div>
      </div>

      <form onSubmit={salvarConfiguracoes}>
        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="settings-section-title">
            <User size={21} />
            <div>
              <h2>Meu perfil</h2>
              <p>Personalize suas informações e sua foto.</p>
            </div>
          </div>

          <div className="settings-avatar-area">
            <div className="settings-avatar">
              {foto ? (
                <img src={foto} alt="Foto de perfil" />
              ) : (
                <span>{(nome || "U").charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="settings-avatar-actions">
              <strong>Sua foto de perfil</strong>
              <p>Escolha uma imagem JPG, PNG ou WEBP de até 3 MB.</p>

              <div className="settings-photo-buttons">
                <label className="settings-upload-button">
                  <ImagePlus size={17} />
                  Escolher foto
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={selecionarFoto}
                  />
                </label>

                {foto && (
                  <button
                    type="button"
                    className="settings-remove-photo"
                    onClick={() => setFoto("")}
                  >
                    <Trash2 size={16} />
                    Remover
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="settings-form-grid">
            <label>
              Nome completo
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@frozenice.com"
                required
              />
            </label>
          </div>
        </motion.section>

        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="settings-section-title">
            <Store size={21} />
            <div>
              <h2>Dados da sorveteria</h2>
              <p>Informações gerais do estabelecimento.</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label>
              Nome da loja
              <input value="FROZEN-ICE" disabled />
            </label>

            <label>
              Telefone
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </label>

            <label className="settings-full-field">
              Endereço
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço da sorveteria"
              />
            </label>
          </div>
        </motion.section>

        <motion.section
          className="settings-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="settings-section-title">
            <Bell size={21} />
            <div>
              <h2>Preferências</h2>
              <p>Escolha como deseja utilizar o sistema.</p>
            </div>
          </div>

          <div className="settings-preference">
            <div>
              <strong>Notificações</strong>
              <p>Receber avisos e atualizações do sistema.</p>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={notificacoesAtivas}
                onChange={(e) => setNotificacoesAtivas(e.target.checked)}
              />
              <span />
            </label>
          </div>

          <div className="settings-preference">
            <div>
              <strong>Aparência</strong>
              <p>Escolha o tema visual do sistema.</p>
            </div>

            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
            </select>
          </div>
        </motion.section>

        {mensagem && (
          <p className="settings-feedback" role="status">
            {mensagem}
          </p>
        )}

        <div className="settings-save-area">
          <button type="submit" className="settings-save-button">
            <Save size={18} />
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
