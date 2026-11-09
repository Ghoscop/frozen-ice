
const CHAVE_VENDAS = "frozen_ice_vendas";

export function listarVendas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_VENDAS)) || [];
  } catch {
    return [];
  }
}

export function salvarVenda(venda) {
  const vendas = listarVendas();

  const novasVendas = [venda, ...vendas];

  localStorage.setItem(CHAVE_VENDAS, JSON.stringify(novasVendas));

  return venda;
}
