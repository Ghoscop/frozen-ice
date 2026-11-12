import api from "./api";

const BASE_URL = "/api/clientes";

function normalizarLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  throw new Error("A API de clientes retornou um formato inesperado.");
}

export async function listarClientes() {
  const { data } = await api.get(BASE_URL);
  return normalizarLista(data);
}

export async function buscarCliente(id) {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
}

export async function cadastrarCliente(cliente) {
  const payload = prepararPayload(cliente);
  const { data } = await api.post(BASE_URL, payload);
  return data;
}

export async function atualizarCliente(id, cliente) {
  const payload = prepararPayload(cliente);
  const { data } = await api.put(`${BASE_URL}/${id}`, payload);
  return data;
}

export async function excluirCliente(id) {
  await api.delete(`${BASE_URL}/${id}`);
}

function prepararPayload({ nome, cpf, telefone, email, endereco }) {
  return {
    nome: nome.trim(),
    cpf: cpf.trim(),
    telefone: telefone.trim(),
    email: email.trim().toLowerCase(),
    endereco: endereco.trim(),
  };
}
