import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, Plus, Pencil, Trash2, IceCream, Package, AlertTriangle,
  X, RefreshCw
} from "lucide-react";
import {
  listarProdutos, cadastrarProduto, atualizarProduto,
  excluirProduto as excluirProdutoAPI
} from "../services/produtosService";

const vazio = { nome: "", sabor: "", preco: "", categoriaId: "", estoque: "0" };
const moeda = (valor) => Number(valor || 0).toLocaleString("pt-BR", {
  style: "currency", currency: "BRL"
});
const erroTexto = (e) => e?.response?.data?.message ||
  e?.response?.data?.erro || e?.message || "Não foi possível concluir a operação.";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(vazio);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function carregarProdutos() {
    setCarregando(true);
    setErro("");
    try {
      setProdutos(await listarProdutos());
    } catch (e) {
      setErro(erroTexto(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregarProdutos(); }, []);

  const categorias = useMemo(() => {
    const valores = produtos.map(p => p.categoria?.nome ?? p.categoriaNome ?? p.categoria)
      .filter(v => typeof v === "string" && v.trim());
    return ["Todas", ...new Set(valores)];
  }, [produtos]);

  const filtrados = useMemo(() => {
    const termo = busca.toLocaleLowerCase("pt-BR").trim();
    return produtos.filter(p => {
      const categoria = p.categoria?.nome ?? p.categoriaNome ?? p.categoria ?? "";
      const texto = [p.nome, p.sabor, categoria].some(v =>
        String(v ?? "").toLocaleLowerCase("pt-BR").includes(termo));
      return texto && (categoriaFiltro === "Todas" || categoria === categoriaFiltro);
    });
  }, [produtos, busca, categoriaFiltro]);

  const totalEstoque = produtos.reduce((s, p) => s + Number(p.estoque ?? p.quantidadeEstoque ?? 0), 0);
  const baixoEstoque = produtos.filter(p => Number(p.estoque ?? p.quantidadeEstoque ?? 0) <= 5).length;

  function abrirNovo() {
    setEditando(null); setForm(vazio); setErro(""); setSucesso(""); setModalAberto(true);
  }
  function abrirEdicao(p) {
    setEditando(p);
    setForm({
      nome: p.nome ?? "",
      sabor: p.sabor ?? "",
      preco: String(p.preco ?? p.preço ?? ""),
      categoriaId: String(p.categoria?.id ?? p.categoriaId ?? ""),
      estoque: String(p.estoque ?? p.quantidadeEstoque ?? 0),
    });
    setErro(""); setSucesso(""); setModalAberto(true);
  }
  function mudarCampo(e) {
    const { name, value } = e.target;
    setForm(atual => ({ ...atual, [name]: value }));
  }

  async function salvar(e) {
    e.preventDefault(); setErro(""); setSucesso("");
    if (!Number.isFinite(Number(form.preco)) || Number(form.preco) <= 0) {
      setErro("Informe um preço válido maior que zero."); return;
    }
    if (!Number.isInteger(Number(form.estoque)) || Number(form.estoque) < 0) {
      setErro("O estoque deve ser um número inteiro igual ou maior que zero."); return;
    }
    setSalvando(true);
    try {
      if (editando) await atualizarProduto(editando.id, form);
      else await cadastrarProduto(form);
      setModalAberto(false); setForm(vazio); setEditando(null);
      setSucesso(editando ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso.");
      await carregarProdutos();
    } catch (e) {
      setErro(erroTexto(e));
    } finally { setSalvando(false); }
  }

  async function excluir(id) {
    const p = produtos.find(item => String(item.id) === String(id));
    if (!window.confirm(`Deseja realmente excluir "${p?.nome ?? "este produto"}"?`)) return;
    setErro(""); setSucesso("");
    try {
      await excluirProdutoAPI(id);
      setProdutos(atual => atual.filter(item => String(item.id) !== String(id)));
      setSucesso("Produto excluído com sucesso.");
    } catch (e) { setErro(erroTexto(e)); }
  }

  return (
    <main className="products-page">
      <motion.div className="products-title" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="clients-eyebrow">CATÁLOGO FROZEN-ICE</span>
          <h2>Produtos 🍨</h2>
          <p>Gerencie sabores, preços e estoque da sorveteria.</p>
        </div>
        <button className="add-product-btn" onClick={abrirNovo}><Plus size={18} /> Novo produto</button>
      </motion.div>

      {(erro || sucesso) && <div role="alert" style={{
        padding: 12, borderRadius: 10, marginBottom: 16,
        color: erro ? "#a33b59" : "#397a5b", background: erro ? "#fff0f3" : "#effaf3"
      }}>{erro || sucesso}</div>}

      <section className="product-summary">
        <div className="summary-card"><div className="summary-icon purple"><IceCream size={22}/></div>
          <div><small>Produtos cadastrados</small><h3>{produtos.length}</h3></div></div>
        <div className="summary-card"><div className="summary-icon blue"><Package size={22}/></div>
          <div><small>Unidades em estoque</small><h3>{totalEstoque}</h3></div></div>
        <div className="summary-card"><div className="summary-icon orange"><AlertTriangle size={22}/></div>
          <div><small>Estoque baixo (até 5)</small><h3>{baixoEstoque}</h3></div></div>
      </section>

      <section className="catalog-toolbar">
        <div className="catalog-search"><Search size={18}/><input value={busca}
          onChange={e => setBusca(e.target.value)} placeholder="Buscar produto ou sabor..."/></div>
        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          {categorias.map(c => <option key={c} value={c}>{c === "Todas" ? "Todas as categorias" : c}</option>)}
        </select>
        <button type="button" onClick={carregarProdutos} title="Atualizar catálogo"
          style={{ border: 0, background: "#f4effb", color: "#8050c0", borderRadius: 10, padding: "0 14px", cursor: "pointer" }}>
          <RefreshCw size={17}/>
        </button>
      </section>

      {carregando ? <p style={{ padding: 25, textAlign: "center" }}>Carregando produtos...</p> :
        filtrados.length === 0 ? <div style={{ padding: 35, textAlign: "center", color: "#9586a6" }}>
          {erro ? "Não foi possível carregar o catálogo." : "Nenhum produto encontrado."}
        </div> : (
          <section className="products-grid">
            <AnimatePresence>
              {filtrados.map(p => {
                const estoque = Number(p.estoque ?? p.quantidadeEstoque ?? 0);
                const categoria = p.categoria?.nome ?? p.categoriaNome ?? p.categoria ?? "Sem categoria";
                return <motion.article className="product-card" key={p.id} layout
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="product-image strawberry">
                    <span>🍦</span>
                    <span className="product-label">{categoria}</span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ margin: "0 0 5px", color: "#49345f" }}>{p.nome}</h3>
                    <p style={{ margin: "0 0 12px", color: "#9586a6", fontSize: 12 }}>{p.sabor || "Sabor não informado"}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <strong style={{ color: "#8050c0", fontSize: 17 }}>{moeda(p.preco ?? p.preço)}</strong>
                      <small style={{ color: estoque <= 5 ? "#d58a32" : "#718b78" }}>
                        Estoque: {estoque}
                      </small>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
                      <button className="product-action-edit" title="Editar" onClick={() => abrirEdicao(p)}><Pencil size={16}/></button>
                      <button className="product-action-delete" title="Excluir" onClick={() => excluir(p.id)}><Trash2 size={16}/></button>
                    </div>
                  </div>
                </motion.article>;
              })}
            </AnimatePresence>
          </section>
        )}

      <AnimatePresence>
        {modalAberto && <motion.div className="product-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={e => { if (e.target === e.currentTarget && !salvando) setModalAberto(false); }}>
          <motion.div className="product-modal" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }}>
            <div className="product-modal-heading">
              <div><span>FROZEN-ICE ✦</span><h2>{editando ? "Editar produto" : "Novo produto"}</h2>
                <p>Preencha os dados do item do catálogo.</p></div>
              <button type="button" onClick={() => setModalAberto(false)} disabled={salvando}><X size={19}/></button>
            </div>
            <form onSubmit={salvar}>
              <div className="product-form-grid">
                <label>Nome do produto<input name="nome" value={form.nome} onChange={mudarCampo} required maxLength={120} placeholder="Ex.: Sorvete de morango"/></label>
                <label>Sabor<input name="sabor" value={form.sabor} onChange={mudarCampo} placeholder="Ex.: Morango cremoso"/></label>
                <label>Preço (R$)<input name="preco" type="number" min="0.01" step="0.01" value={form.preco} onChange={mudarCampo} required/></label>
                <label>ID da categoria<input name="categoriaId" type="number" min="1" value={form.categoriaId} onChange={mudarCampo} placeholder="ID informado pelo backend"/></label>
                <label>Quantidade em estoque<input name="estoque" type="number" min="0" step="1" value={form.estoque} onChange={mudarCampo} required/></label>
              </div>
              {erro && <p role="alert" style={{ color: "#b34d68", fontSize: 12 }}>{erro}</p>}
              <div className="product-modal-actions">
                <button type="button" onClick={() => setModalAberto(false)} disabled={salvando}>Cancelar</button>
                <button className="save-product-btn" type="submit" disabled={salvando}>{salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
  );
}
