
import { useState } from "react";
import { motion } from "framer-motion";
import { fazerLogin } from "../services/authService";
import {
  IceCreamCone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Snowflake,
} from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  
async function entrar(event) {
  event.preventDefault();
  setErro("");

  const emailNormalizado = email.trim().toLowerCase();

  if (!emailNormalizado || !senha) {
    setErro("Informe seu e-mail e sua senha.");
    return;
  }

  try {
    setCarregando(true);

    const usuario = await fazerLogin(emailNormalizado, senha);

    onLogin(usuario);
  } catch (error) {
    if (error.response?.status === 401) {
      setErro("E-mail ou senha incorretos.");
    } else if (error.response?.status === 403) {
      setErro("Seu usuário não tem permissão para acessar o sistema.");
    } else if (!error.response) {
      setErro("Não foi possível conectar ao servidor. Verifique se a API está ligada.");
    } else {
      setErro(
        error.response?.data?.message ||
        "Não foi possível realizar o login. Tente novamente."
      );
    }
  } finally {
    setCarregando(false);
  }
}

  return (
    <main className="login-page">
      <motion.div
        className="login-decoration login-decoration-one"
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <IceCreamCone size={65} />
      </motion.div>

      <motion.div
        className="login-decoration login-decoration-two"
        animate={{ y: [0, 13, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Snowflake size={48} />
      </motion.div>

      <motion.section
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-brand">
          <div className="login-logo">
            <IceCreamCone size={30} />
          </div>
          <h1>FROZEN<span>-ICE</span></h1>
          <p>Um mundo de sabores espera por você!</p>
        </div>

        <div className="login-welcome">
          <span>SEJA BEM-VINDO(A) ♡</span>
          <h2>Entre na sua conta</h2>
          <p>Informe seus dados para acessar o sistema.</p>
        </div>

        <form onSubmit={entrar} className="login-form">
          <label className="login-field">
            E-mail
            <div className="login-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="seuemail@frozenice.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="login-field">
            Senha
            <div className="login-input">
              <Lock size={18} />
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          {erro && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {erro}
            </motion.div>
          )}

            <button
              type="submit"
              className="login-submit"
              disabled={carregando}
            >
              {carregando ? "Entrando..." : "Entrar no sistema"}
              {!carregando && <ArrowRight size={18} />}
            </button>
        </form>

        <div className="login-demo">
          <strong>Acesso para demonstração</strong>
          <span>Administrador: admin@frozenice.com</span>
          <span>Senha: admin123</span>
          <span>Atendente: ana@frozenice.com</span>
          <span>Senha: ana12345</span>
        </div>

        <footer className="login-footer">
          FROZEN-ICE © 2026 · Feito com ♡ e muito sabor
        </footer>
      </motion.section>
    </main>
  );
}
