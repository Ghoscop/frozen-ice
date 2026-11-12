import api from "./api";

const BASE_URL = "/api/usuarios";

export async function listarUsuarios() {
  const { data } = await api.get(BASE_URL);

  // Aceita tanto uma lista simples quanto paginação do Spring Data.
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;

  throw new Error("A API de usuários retornou um formato inesperado.");
}

export async function buscarUsuario(id) {
  const { data } = await api.get(`${BASE_URL}/${encodeURIComponent(id)}`);
  return data;
}

export async function cadastrarUsuario({ nome, email, senha }) {
  const { data } = await api.post(BASE_URL, {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha,
  });
  return data;
}

export async function atualizarUsuario(id, { nome, email, senha }) {
  const payload = {
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
  };

  // Senha vazia significa manter a senha atual.
  if (senha?.trim()) payload.senha = senha;

  const { data } = await api.put(
    `${BASE_URL}/${encodeURIComponent(id)}`,
    payload
  );

  return data;
}

export async function excluirUsuario(id) {
  await api.delete(`${BASE_URL}/${encodeURIComponent(id)}`);
}
