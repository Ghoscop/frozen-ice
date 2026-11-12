import api from "./api";

// Contrato esperado da API. Ajuste as rotas caso o backend do grupo use outros caminhos.
export async function buscarMeuPerfil() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function atualizarMeuPerfil(dados) {
  const response = await api.put("/api/usuarios/me", dados);
  return response.data;
}

export async function enviarFotoPerfil(arquivo) {
  const formData = new FormData();
  formData.append("arquivo", arquivo);
  const response = await api.post("/api/usuarios/me/avatar", formData);
  return response.data;
}

export async function buscarConfiguracoes() {
  const response = await api.get("/api/configuracoes/me");
  return response.data;
}

export async function salvarConfiguracoes(dados) {
  const response = await api.put("/api/configuracoes/me", dados);
  return response.data;
}
