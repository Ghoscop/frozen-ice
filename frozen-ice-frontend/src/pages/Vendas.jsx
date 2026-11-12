import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote,
  Smartphone, CheckCircle, IceCream, UserRound, RefreshCw, AlertCircle
} from "lucide-react";
import {
  listarProdutosParaVenda, listarClientesParaVenda, registrarVenda
} from "../services/vendasService";

const formatar = valor => Number(valor || 0).toLocaleString("pt-BR", {
  style: "currency", currency: "BRL"
});
const getId = obj => obj?.id ?? obj?.produtoId ?? obj?.clienteId;
const getNome = obj => obj?.nome ?? obj?.name ?? "Produto";
const getPreco = obj => Number(obj?.preco ?? obj?.preço ?? obj?.valor ?? 0);
const getEstoque = obj => Number(obj?.estoque ?? obj?.quantidadeEstoque ?? obj?.stock ?? 0);

export default function Vendas({ usuario, onVendaConcluida }) {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [pagamento, setPagamento] = useState("PIX");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarCatalogo() {
    setCarregando(true);
    setErro("");
    try {
      const [ps, cs] = await Promise.all([
        listarProdutosParaVenda(), listarClientesParaVenda()
      ]);
      setProdutos(Array.isArray(ps) ? ps : []);
      setClientes(Array.isArray(cs) ? cs : []);
    } catch (e) {
      setErro(e?.response?.data?.message || e?.response?.data?.mensagem ||
        "Não foi possível carregar produtos e clientes. Verifique a API.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarCatalogo(); }, []);

  const categorias = useMemo(() => [
    "Todas", ...new Set(produtos.map(p => p.categoria?.nome ?? p.categoriaNome ?? p.categoria).filter(Boolean))
  ], [produtos]);

  const filtrados = useMemo(() => categoria === "Todas" ? produtos :
    produtos.filter(p => (p.categoria?.nome ?? p.categoriaNome ?? p.categoria) === categoria),
  [produtos, categoria]);

  const quantidadeTotal = carrinho.reduce((s, i) => s + i.quantidade, 0);
  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);

  function adicionar(produto) {
    const id = getId(produto);
    const estoque = getEstoque(produto);
    const existente = carrinho.find(i => String(i.id) === String(id));
    if (estoque <= (existente?.quantidade || 0)) {
      setErro(`Estoque insuficiente para ${getNome(produto)}.`);
      return;
    }
    setErro(""); setMensagem("");
    setCarrinho(atual => {
      const item = atual.find(i => String(i.id) === String(id));
      if (item) return atual.map(i => String(i.id) === String(id)
        ? { ...i, quantidade: i.quantidade + 1 } : i);
      return [...atual, {
        id, nome: getNome(produto), preco: getPreco(produto),
        estoque, emoji: produto.emoji ?? "🍦",
        cor: produto.cor ?? "#f1e8fb",
        categoria: produto.categoria?.nome ?? produto.categoriaNome ?? produto.categoria ?? "Sorvetes"
      }];
    });
  }

  function alterarQuantidade(id, valor) {
    setCarrinho(atual => atual.map(i => String(i.id) === String(id) ? {
      ...i, quantidade: Math.max(1, Math.min(i.estoque, i.quantidade + valor))
    } : i));
  }

  function remover(id) {
    setCarrinho(atual => atual.filter(i => String(i.id) !== String(id)));
  }

  async function finalizarVenda() {
    if (!carrinho.length) return;
    if (!clienteId) {
      setErro("Selecione um cliente antes de finalizar a venda.");
      return;
    }
    setEnviando(true); setErro(""); setMensagem("");
    try {
      const payload = {
        clienteId: Number(clienteId),
        formaPagamento: pagamento,
        itens: carrinho.map(i => ({ produtoId: Number(i.id), quantidade: i.quantidade }))
      };
      // O servidor deve identificar o caixa pelo token autenticado.
      if (usuario?.id != null) payload.usuarioId = Number(usuario.id);
      const venda = await registrarVenda(payload);
      setCarrinho([]);
      setClienteId("");
      setMensagem(`Venda registrada com sucesso${venda?.id ? `! Pedido #${venda.id}.` : "!"}`);
      await carregarCatalogo();
      onVendaConcluida?.(venda);
    } catch (e) {
      setErro(e?.response?.data?.message || e?.response?.data?.mensagem ||
        "Não foi possível registrar a venda. Confira estoque e conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <motion.div className="sales-page" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="sales-heading">
        <div><span className="sales-eyebrow">FROZEN-ICE • CAIXA</span>
          <h1>Ponto de Venda <span>🍦</span></h1>
          <p>Monte o pedido e finalize a venda de forma rápida.</p>
        </div>
        <div className="sales-order-badge"><ShoppingCart size={19}/>{quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"} no pedido</div>
      </div>

      {erro && <div className="sale-api-message error"><AlertCircle size={17}/>{erro}</div>}
      {mensagem && <div className="sale-api-message success"><CheckCircle size={17}/>{mensagem}</div>}

      <div className="sales-layout">
        <section className="sales-catalog">
          <div className="sales-section-title"><div><h2>Escolha os sabores</h2><p>Produtos carregados do cadastro.</p></div>
            <button className="sales-refresh" onClick={carregarCatalogo} disabled={carregando} type="button"><RefreshCw size={15}/> Atualizar</button>
            <IceCream size={25}/>
          </div>
          <div className="sales-filters">
            {categorias.map(cat => <button key={cat} className={categoria === cat ? "active" : ""} onClick={() => setCategoria(cat)}>{cat}</button>)}
          </div>
          {carregando ? <div className="cart-empty">Carregando produtos e clientes...</div> :
            <div className="sales-products-grid">
              {filtrados.map(produto => {
                const estoque = getEstoque(produto);
                return <motion.article className="sales-product-card" key={getId(produto)} whileHover={{ y: -5 }} layout>
                  <div className="sales-product-emoji" style={{ background: produto.cor ?? "#f4eafa" }}>{produto.emoji ?? "🍦"}</div>
                  <span className="sales-product-category">{produto.categoria?.nome ?? produto.categoriaNome ?? produto.categoria ?? "Sorvetes"}</span>
                  <h3>{getNome(produto)}</h3>
                  <strong>{formatar(getPreco(produto))}</strong>
                  <small className={estoque <= 5 ? "sales-stock-low" : "sales-stock"}>{estoque} em estoque</small>
                  <button className="sales-add-button" disabled={estoque <= 0} onClick={() => adicionar(produto)}><Plus size={17}/> Adicionar</button>
                </motion.article>;
              })}
              {filtrados.length === 0 && <div className="cart-empty">Nenhum produto cadastrado nesta categoria.</div>}
            </div>}
        </section>

        <aside className="sales-cart">
          <div className="cart-heading"><div><h2><ShoppingCart size={21}/> Seu pedido</h2><p>Confira os itens selecionados</p></div><span>{quantidadeTotal}</span></div>
          <label className="sale-client-select"><span><UserRound size={15}/> Cliente da venda</span>
            <select value={clienteId} onChange={e => setClienteId(e.target.value)}>
              <option value="">Selecione um cliente</option>
              {clientes.map(c => <option key={getId(c)} value={getId(c)}>{c.nome ?? c.name}</option>)}
            </select>
          </label>
          <div className="cart-items">
            <AnimatePresence>
              {carrinho.map(item => <motion.div className="cart-item" key={item.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} layout>
                <div className="cart-item-emoji" style={{ background: item.cor }}>{item.emoji}</div>
                <div className="cart-item-info"><strong>{item.nome}</strong><span>{formatar(item.preco)}</span>
                  <div className="cart-quantity">
                    <button onClick={() => alterarQuantidade(item.id, -1)}><Minus size={13}/></button><span>{item.quantidade}</span>
                    <button disabled={item.quantidade >= item.estoque} onClick={() => alterarQuantidade(item.id, 1)}><Plus size={13}/></button>
                  </div>
                </div>
                <div className="cart-item-end"><strong>{formatar(item.preco * item.quantidade)}</strong>
                  <button className="cart-remove" onClick={() => remover(item.id)} aria-label={`Remover ${item.nome}`}><Trash2 size={15}/></button>
                </div>
              </motion.div>)}
            </AnimatePresence>
            {carrinho.length === 0 && <div className="cart-empty"><span>🍨</span><strong>Seu pedido está vazio</strong><p>Adicione um sabor para começar!</p></div>}
          </div>

          <div className="cart-payment"><h3>Forma de pagamento</h3><div className="payment-options">
            {[{ nome: "PIX", label: "Pix", icon: Smartphone }, { nome: "CARTAO", label: "Cartão", icon: CreditCard }, { nome: "DINHEIRO", label: "Dinheiro", icon: Banknote }].map(op => {
              const Icon = op.icon;
              return <button type="button" key={op.nome} className={pagamento === op.nome ? "selected" : ""} onClick={() => setPagamento(op.nome)}><Icon size={17}/>{op.label}</button>;
            })}
          </div></div>
          <div className="cart-total"><span>Total do pedido</span><strong>{formatar(total)}</strong></div>
          <button className="checkout-button" disabled={!carrinho.length || enviando || carregando} onClick={finalizarVenda}>
            <CheckCircle size={19}/>{enviando ? "Registrando..." : "Finalizar venda"}
          </button>
        </aside>
      </div>
    </motion.div>
  );
}
