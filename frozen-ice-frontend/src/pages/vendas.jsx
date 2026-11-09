
import { useState } from "react";
import { salvarVenda } from "../services/vendasService";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle,
  IceCream
} from "lucide-react";

const produtos = [
  { id: 1, nome: "Chocolate Belga", categoria: "Tradicional", preco: 12, emoji: "🍫", cor: "#f4d9c7" },
  { id: 2, nome: "Morango Cremoso", categoria: "Frutas", preco: 10, emoji: "🍓", cor: "#ffdce7" },
  { id: 3, nome: "Cookies & Cream", categoria: "Especial", preco: 14, emoji: "🍪", cor: "#e8e1dc" },
  { id: 4, nome: "Pistache Premium", categoria: "Especial", preco: 16, emoji: "🍨", cor: "#dff0d8" },
  { id: 5, nome: "Açaí Tropical", categoria: "Frutas", preco: 13, emoji: "🫐", cor: "#e5dcfa" },
  { id: 6, nome: "Doce de Leite", categoria: "Tradicional", preco: 11, emoji: "🍮", cor: "#f7e5c5" }
];

export default function Vendas() {
  const [carrinho, setCarrinho] = useState([]);
  const [ultimaVenda, setUltimaVenda] = useState(null);
  const [categoria, setCategoria] = useState("Todas");
  const [pagamento, setPagamento] = useState("Pix");
  const [finalizada, setFinalizada] = useState(false);

  const filtrados = categoria === "Todas"
    ? produtos
    : produtos.filter(p => p.categoria === categoria);

  const adicionar = (produto) => {
    setFinalizada(false);
    setCarrinho(atual => {
      const existente = atual.find(item => item.id === produto.id);

      if (existente) {
        return atual.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...atual, { ...produto, quantidade: 1 }];
    });
  };

  const alterarQuantidade = (id, valor) => {
    setCarrinho(atual =>
      atual
        .map(item =>
          item.id === id
            ? { ...item, quantidade: item.quantidade + valor }
            : item
        )
        .filter(item => item.quantidade > 0)
    );
  };

  const remover = (id) => {
    setCarrinho(atual => atual.filter(item => item.id !== id));
  };

  const total = carrinho.reduce(
    (soma, item) => soma + item.preco * item.quantidade,
    0
  );

  const quantidadeTotal = carrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0
  );

  const formatar = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

 const finalizarVenda = () => {
  if (carrinho.length === 0) return;

  const novaVenda = {
    id: Date.now(),
    cliente: "Cliente balcão",
    data: new Date().toLocaleDateString("en-CA"),
    hora: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    pagamento,
    status: "Concluída",
    itens: carrinho.map(item => ({
      nome: item.nome,
      quantidade: item.quantidade,
      preco: item.preco
    }))
  };

  salvarVenda(novaVenda);

  setUltimaVenda(novaVenda);
  setFinalizada(true);
  setCarrinho([]);
};

  return (
    <motion.div
      className="sales-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="sales-heading">
        <div>
          <span className="sales-eyebrow">FROZEN-ICE • CAIXA</span>
          <h1>Ponto de Venda <span>🍦</span></h1>
          <p>Monte o pedido e finalize a venda de forma rápida.</p>
        </div>

        <div className="sales-order-badge">
          <ShoppingCart size={19} />
          {quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"} no pedido
        </div>
      </div>

      <div className="sales-layout">
        <section className="sales-catalog">
          <div className="sales-section-title">
            <div>
              <h2>Escolha os sabores</h2>
              <p>Selecione os produtos para adicionar ao pedido.</p>
            </div>
            <IceCream size={25} />
          </div>

          <div className="sales-filters">
            {["Todas", "Tradicional", "Frutas", "Especial"].map(cat => (
              <button
                key={cat}
                className={categoria === cat ? "active" : ""}
                onClick={() => setCategoria(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="sales-products-grid">
            {filtrados.map(produto => (
              <motion.article
                className="sales-product-card"
                key={produto.id}
                whileHover={{ y: -5 }}
                layout
              >
                <div
                  className="sales-product-emoji"
                  style={{ background: produto.cor }}
                >
                  {produto.emoji}
                </div>

                <span className="sales-product-category">
                  {produto.categoria}
                </span>

                <h3>{produto.nome}</h3>
                <strong>{formatar(produto.preco)}</strong>

                <button
                  className="sales-add-button"
                  onClick={() => adicionar(produto)}
                >
                  <Plus size={17} />
                  Adicionar
                </button>
              </motion.article>
            ))}
          </div>
        </section>

        <aside className="sales-cart">
          <div className="cart-heading">
            <div>
              <h2><ShoppingCart size={21} /> Seu pedido</h2>
              <p>Confira os itens selecionados</p>
            </div>
            <span>{quantidadeTotal}</span>
          </div>

          <div className="cart-items">
            <AnimatePresence>
              {carrinho.map(item => (
                <motion.div
                  className="cart-item"
                  key={item.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  layout
                >
                  <div
                    className="cart-item-emoji"
                    style={{ background: item.cor }}
                  >
                    {item.emoji}
                  </div>

                  <div className="cart-item-info">
                    <strong>{item.nome}</strong>
                    <span>{formatar(item.preco)}</span>

                    <div className="cart-quantity">
                      <button onClick={() => alterarQuantidade(item.id, -1)}>
                        <Minus size={13} />
                      </button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => alterarQuantidade(item.id, 1)}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-end">
                    <strong>
                      {formatar(item.preco * item.quantidade)}
                    </strong>
                    <button
                      className="cart-remove"
                      onClick={() => remover(item.id)}
                      aria-label={`Remover ${item.nome}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {carrinho.length === 0 && (
              <div className="cart-empty">
                <span>🍨</span>
                <strong>Seu pedido está vazio</strong>
                <p>Adicione um sabor para começar!</p>
              </div>
            )}
          </div>

          <div className="cart-payment">
            <h3>Forma de pagamento</h3>

            <div className="payment-options">
              {[
                { nome: "Pix", icon: Smartphone },
                { nome: "Cartão", icon: CreditCard },
                { nome: "Dinheiro", icon: Banknote }
              ].map(opcao => {
                const Icon = opcao.icon;

                return (
                  <button
                    key={opcao.nome}
                    className={pagamento === opcao.nome ? "selected" : ""}
                    onClick={() => setPagamento(opcao.nome)}
                  >
                    <Icon size={17} />
                    {opcao.nome}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cart-total">
            <span>Total do pedido</span>
            <strong>{formatar(total)}</strong>
          </div>

          <button
            className="checkout-button"
            disabled={carrinho.length === 0}
            onClick={finalizarVenda}
          >
            <CheckCircle size={19} />
            Finalizar venda
          </button>

          <AnimatePresence>
            {finalizada && (
              <motion.div
                className="sale-success"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <CheckCircle size={18} />
                Venda finalizada! Pagamento: {pagamento}.
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </motion.div>
  );
}
