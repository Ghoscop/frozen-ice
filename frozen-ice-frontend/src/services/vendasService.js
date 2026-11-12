import api from "./api";

function extrairLista(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.dados)) return data.dados;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export async function listarProdutosParaVenda() {
  const { data } = await api.get("/api/produtos");
  return extrairLista(data);
}

export async function listarClientesParaVenda() {
  const { data } = await api.get("/api/clientes");
  return extrairLista(data);
}

export async function registrarVenda(payload) {
  const { data } = await api.post("/api/vendas", payload);
  return data;
}

export async function listarVendas() {
  const { data } = await api.get("/api/vendas");
  return extrairLista(data);
}
