import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Store, User, Bell, Palette, Save, ImagePlus, Trash2, LoaderCircle
} from "lucide-react";
import {
  buscarMeuPerfil, atualizarMeuPerfil, enviarFotoPerfil,
  buscarConfiguracoes, salvarConfiguracoes
} from "../services/configuracoesService";

export default function Configuracoes({ usuario, onAtualizarUsuario }) {
  const [foto, setFoto] = useState(usuario?.avatar || "");
  const [arquivoFoto, setArquivoFoto] = useState(null);
  const [removerFoto, setRemoverFoto] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const [tema, setTema] = useState("claro");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const [perfil, preferencias] = await Promise.all([
          buscarMeuPerfil(),
          buscarConfiguracoes()
        ]);
        if (!ativo) return;
        const perfilAtual = perfil?.usuario || perfil;
        setNome(perfilAtual?.nome || usuario?.nome || "");
        setEmail(perfilAtual?.email || usuario?.email || "");
        setFoto(perfilAtual?.avatarUrl || perfilAtual?.avatar || usuario?.avatar || "");
        setTelefone(preferencias?.telefone || "");
        setEndereco(preferencias?.endereco || "");
        setNotificacoesAtivas(preferencias?.notificacoesAtivas ?? true);
        setTema(preferencias?.tema || "claro");
      } catch (e) {
        if (ativo) setErro(e.response?.data?.message || "Não foi possível carregar as configurações. Verifique a API.");
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => { ativo = false; };
  }, [usuario?.nome, usuario?.email, usuario?.avatar]);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Selecione uma imagem JPG, PNG ou WEBP.");
      event.target.value = "";
      return;
    }
    if (arquivo.size > 3 * 1024 * 1024) {
      setErro("Escolha uma imagem de até 3 MB.");
      event.target.value = "";
      return;
    }
    setErro("");
    setMensagem("");
    setArquivoFoto(arquivo);
    setRemoverFoto(false);
    setFoto(URL.createObjectURL(arquivo));
  }

  async function salvarConfiguracoesHandler(event) {
    event.preventDefault();
    setSalvando(true);
    setErro("");
    setMensagem("");
    try {
      const perfilAtualizado = await atualizarMeuPerfil({ nome: nome.trim(), email: email.trim() });
      let fotoAtualizada = perfilAtualizado?.avatarUrl || perfilAtualizado?.avatar || foto;

      if (arquivoFoto) {
        const respostaFoto = await enviarFotoPerfil(arquivoFoto);
        fotoAtualizada = respostaFoto?.avatarUrl || respostaFoto?.url || fotoAtualizada;
      } else if (removerFoto) {
        // O backend deve aceitar avatarRemovido=true para remover a imagem atual.
        const resposta = await atualizarMeuPerfil({ nome: nome.trim(), email: email.trim(), avatarRemovido: true });
        fotoAtualizada = resposta?.avatarUrl || "";
      }

      await salvarConfiguracoes({
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        notificacoesAtivas,
        tema
      });

      const usuarioAtualizado = {
        ...usuario,
        ...(perfilAtualizado || {}),
        nome: perfilAtualizado?.nome || nome.trim(),
        email: perfilAtualizado?.email || email.trim(),
        avatar: fotoAtualizada
      };
      onAtualizarUsuario?.(usuarioAtualizado);
      setFoto(fotoAtualizada || "");
      setArquivoFoto(null);
      setRemoverFoto(false);
      setMensagem("Configurações salvas com sucesso!");
    } catch (e) {
      setErro(e.response?.data?.message || e.response?.data?.mensagem || "Não foi possível salvar. Confira os endpoints do backend.");
    } finally {
      setSalvando(false);
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
        <div className="settings-heading-icon"><Palette size={28} /></div>
      </div>

      {carregando ? <p>Carregando configurações...</p> : (
        <form onSubmit={salvarConfiguracoesHandler}>
          <motion.section className="settings-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="settings-section-title">
              <User size={21} /><div><h2>Meu perfil</h2><p>Personalize suas informações e sua foto.</p></div>
            </div>
            <div className="settings-avatar-area">
              <div className="settings-avatar">
                {foto ? <img src={foto} alt="Foto de perfil" /> : <span>{(nome || "U").charAt(0).toUpperCase()}</span>}
              </div>
              <div className="settings-avatar-actions">
                <strong>Sua foto de perfil</strong>
                <p>Escolha uma imagem JPG, PNG ou WEBP de até 3 MB.</p>
                <div className="settings-photo-buttons">
                  <label className="settings-upload-button">
                    <ImagePlus size={17} /> Escolher foto
                    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={selecionarFoto} />
                  </label>
                  {foto && <button type="button" className="settings-remove-photo" onClick={() => {
                    setFoto(""); setArquivoFoto(null); setRemoverFoto(true);
                  }}><Trash2 size={16} /> Remover</button>}
                </div>
              </div>
            </div>
            <div className="settings-form-grid">
              <label>Nome completo<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required /></label>
              <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@frozenice.com" required /></label>
            </div>
          </motion.section>

          <motion.section className="settings-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="settings-section-title">
              <Store size={21} /><div><h2>Dados da sorveteria</h2><p>Informações gerais do estabelecimento.</p></div>
            </div>
            <div className="settings-form-grid">
              <label>Nome da loja<input value="FROZEN-ICE" disabled /></label>
              <label>Telefone<input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 00000-0000" /></label>
              <label className="settings-full-field">Endereço<input value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Endereço da sorveteria" /></label>
            </div>
          </motion.section>

          <motion.section className="settings-card" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="settings-section-title">
              <Bell size={21} /><div><h2>Preferências</h2><p>Escolha como deseja utilizar o sistema.</p></div>
            </div>
            <div className="settings-preference">
              <div><strong>Notificações</strong><p>Receber avisos e atualizações do sistema.</p></div>
              <label className="settings-switch">
                <input type="checkbox" checked={notificacoesAtivas} onChange={(e) => setNotificacoesAtivas(e.target.checked)} /><span />
              </label>
            </div>
            <div className="settings-preference">
              <div><strong>Aparência</strong><p>Escolha o tema visual do sistema.</p></div>
              <select value={tema} onChange={(e) => setTema(e.target.value)}>
                <option value="claro">Claro</option><option value="escuro">Escuro</option>
              </select>
            </div>
          </motion.section>

          {erro && <p className="settings-feedback" role="alert">{erro}</p>}
          {mensagem && <p className="settings-feedback" role="status">{mensagem}</p>}
          <div className="settings-save-area">
            <button type="submit" className="settings-save-button" disabled={salvando}>
              {salvando ? <LoaderCircle size={18} /> : <Save size={18} />}
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
