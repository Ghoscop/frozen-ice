import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Pencil, Trash2, IceCream,
  X, Package, AlertTriangle
} from "lucide-react";

const initialProducts = [
  {
    id: 1,
    nome: "Chocolate Belga",
    sabor: "Chocolate",
    categoria: "Tradicional",
    preco: 12.90,
    estoque: 35,
    emoji: "🍫",
    cor: "chocolate"
  },
  {
    id: 2,
    nome: "Morango Cremoso",
    sabor: "Morango",
    categoria: "Frutas",
    preco: 11.90,
    estoque: 28,
    emoji: "🍓",
    cor: "strawberry"
  },
  {
    id: 3,
    nome: "Cookies & Cream",
    sabor: "Baunilha",
    categoria: "Especial",
    preco: 14.90,
    estoque: 4,
    emoji: "🍪",
    cor: "cookies"
  },
  {
    id: 4,
    nome: "Pistache Premium",
    sabor: "Pistache",
    categoria: "Especial",
    preco: 15.90,
    estoque: 18,
    emoji: "🍵",
    cor: "pistachio"
  },
  {
    id: 5,
    nome: "Açaí Tropical",
    sabor: "Açaí",
    categoria: "Frutas",
    preco: 13.90,
    estoque: 0,
    emoji: "🫐",
    cor: "acai"
  },
  {
    id: 6,
    nome: "Doce de Leite",
    sabor: "Doce de leite",
    categoria: "Tradicional",
    preco: 12.50,
    estoque: 22,
    emoji: "🍮",
    cor: "caramel"
  }
];

const emptyForm = {
  nome: "",
  sabor: "",
  categoria: "Tradicional",
  preco: "",
  estoque: "",
  emoji: "🍦",
  cor: "chocolate"
};

export default function Produtos() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nome.toLowerCase().includes(search.toLowerCase()) ||
      product.sabor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Todas" || product.categoria === category;

    return matchesSearch && matchesCategory;
  });

  const totalStock = products.reduce(
    (total, product) => total + Number(product.estoque), 0
  );

  const lowStock = products.filter(
    (product) => product.estoque > 0 && product.estoque <= 5
  ).length;

  function openNewProduct() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditProduct(product) {
    setEditingId(product.id);
    setForm({
      nome: product.nome,
      sabor: product.sabor,
      categoria: product.categoria,
      preco: String(product.preco),
      estoque: String(product.estoque),
      emoji: product.emoji,
      cor: product.cor
    });
    setModalOpen(true);
  }

  function saveProduct(event) {
    event.preventDefault();

    const productData = {
      ...form,
      preco: Number(form.preco),
      estoque: Number(form.estoque)
    };

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      setProducts((current) => [
        ...current,
        {
          id: Date.now(),
          ...productData
        }
      ]);
    }

    setModalOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  function deleteProduct(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (confirmed) {
      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );
    }
  }

  return (
    <motion.div
      className="products-page"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="products-title">
        <div>
          <span className="welcome-tag">GESTÃO DA SORVETERIA 🍦</span>
          <h2>Nosso catálogo</h2>
          <p>Gerencie os sabores e produtos do FROZEN-ICE.</p>
        </div>

        <button className="add-product-btn" onClick={openNewProduct}>
          <Plus size={19} />
          Novo produto
        </button>
      </div>

      <div className="product-summary">
        <div className="summary-card">
          <div className="summary-icon purple"><IceCream /></div>
          <div>
            <small>Total de produtos</small>
            <h3>{products.length}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue"><Package /></div>
          <div>
            <small>Unidades em estoque</small>
            <h3>{totalStock}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange"><AlertTriangle /></div>
          <div>
            <small>Estoque baixo</small>
            <h3>{lowStock}</h3>
          </div>
        </div>
      </div>

      <div className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar sorvetes..."
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Todas">Todas as categorias</option>
          <option value="Tradicional">Tradicional</option>
          <option value="Frutas">Frutas</option>
          <option value="Especial">Especial</option>
        </select>
      </div>

      <div className="catalog-heading">
        <h3>🍨 Sabores disponíveis</h3>
        <span>{filteredProducts.length} produtos encontrados</span>
      </div>

      <div className="catalog-grid">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <motion.article
              key={product.id}
              className="catalog-card"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -7 }}
            >
              <div className={`catalog-image ${product.cor}`}>
                <span className="catalog-emoji">{product.emoji}</span>
                <span className="catalog-category">{product.categoria}</span>
              </div>

              <div className="catalog-info">
                <small>SABOR {product.sabor.toUpperCase()}</small>
                <h3>{product.nome}</h3>

                <div className="catalog-price">
                  R$ {product.preco.toFixed(2).replace(".", ",")}
                </div>

                <div className="stock-status">
                  <span
                    className={
                      product.estoque === 0
                        ? "stock-out"
                        : product.estoque <= 5
                        ? "stock-low"
                        : "stock-ok"
                    }
                  >
                    {product.estoque === 0
                      ? "Indisponível"
                      : product.estoque <= 5
                      ? "Estoque baixo"
                      : "Disponível"}
                  </span>

                  <span>{product.estoque} un.</span>
                </div>

                <div className="catalog-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditProduct(product)}
                  >
                    <Pencil size={15} /> Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product.id)}
                    aria-label={`Excluir ${product.nome}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-products">
          <span>🍦</span>
          <h3>Nenhum sabor encontrado!</h3>
          <p>Tente mudar sua pesquisa ou categoria.</p>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setModalOpen(false);
              }
            }}
          >
            <motion.div
              className="product-modal"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="modal-heading">
                <div>
                  <span>🍦 FROZEN-ICE</span>
                  <h2>{editingId ? "Editar produto" : "Novo produto"}</h2>
                  <p>Preencha os dados do seu sorvete.</p>
                </div>

                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  <X />
                </button>
              </div>

              <form onSubmit={saveProduct}>
                <label>Nome do produto</label>
                <input
                  required
                  maxLength={80}
                  placeholder="Ex.: Chocolate Belga"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />

                <label>Sabor</label>
                <input
                  required
                  placeholder="Ex.: Chocolate"
                  value={form.sabor}
                  onChange={(e) => setForm({ ...form, sabor: e.target.value })}
                />

                <label>Categoria</label>
                <select
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                >
                  <option>Tradicional</option>
                  <option>Frutas</option>
                  <option>Especial</option>
                </select>

                <div className="form-two-columns">
                  <div>
                    <label>Preço (R$)</label>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.preco}
                      onChange={(e) => setForm({ ...form, preco: e.target.value })}
                    />
                  </div>

                  <div>
                    <label>Estoque</label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={form.estoque}
                      onChange={(e) => setForm({ ...form, estoque: e.target.value })}
                    />
                  </div>
                </div>

                <label>Emoji do produto</label>
                <select
                  value={form.emoji}
                  onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                >
                  <option value="🍦">🍦 Casquinha</option>
                  <option value="🍨">🍨 Taça</option>
                  <option value="🍫">🍫 Chocolate</option>
                  <option value="🍓">🍓 Morango</option>
                  <option value="🍪">🍪 Cookies</option>
                  <option value="🍧">🍧 Raspadinha</option>
                  <option value="🫐">🫐 Frutas</option>
                </select>

                <button className="save-product-btn" type="submit">
                  {editingId ? "Salvar alterações" : "Cadastrar produto"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}