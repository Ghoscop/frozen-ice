import api from "./api";

const BASE_URL = "/api/notificacoes";

export async function listarNotificacoes() {
  const response = await api.get(BASE_URL);
  return response.data;
}

export async function marcarNotificacaoComoLida(id) {
  const response = await api.patch(`${BASE_URL}/${encodeURIComponent(id)}/lida`);
  return response.data;
}

export async function marcarTodasNotificacoesComoLidas() {
  const response = await api.patch(`${BASE_URL}/lidas`);
  return response.data;
}

export async function excluirNotificacao(id) {
  const response = await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`);
  return response.data;
}
