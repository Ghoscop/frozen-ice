import api from "./api";

const BASE_URL = "/api/produtos";

function normalizarLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  throw new Error("A API de produtos retornou um formato inesperado.");
}

export async function listarProdutos() {
  const { data } = await api.get(BASE_URL);
  return normalizarLista(data);
}

export async function buscarProduto(id) {
  const { data } = await api.get(`${BASE_URL}/${id}`);
  return data;
}

export async function cadastrarProduto(produto) {
  const { data } = await api.post(BASE_URL, prepararPayload(produto));
  return data;
}

export async function atualizarProduto(id, produto) {
  const { data } = await api.put(`${BASE_URL}/${id}`, prepararPayload(produto));
  return data;
}

export async function excluirProduto(id) {
  await api.delete(`${BASE_URL}/${id}`);
}

function prepararPayload({ nome, preco, sabor, categoriaId, estoque }) {
  return {
    nome: nome.trim(),
    preco: Number(preco),
    sabor: sabor.trim(),
    categoriaId: categoriaId ? Number(categoriaId) : null,
    estoque: Number(estoque),
  };
}
