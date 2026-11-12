package com.example.AtividadeN2.service;

import com.example.AtividadeN2.dto.ProdutoRequestDTO;
import com.example.AtividadeN2.entity.Categoria;
import com.example.AtividadeN2.entity.Produto;
import com.example.AtividadeN2.repository.CategoriaRepository;
import com.example.AtividadeN2.repository.ProdutoRepository;

import java.util.List;
import java.util.UUID;

public class ProdutoService {
    private ProdutoRepository produtoRepository;
    private CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public Produto cadastrar(ProdutoRequestDTO dto){
        // Valida se a categoria existe, atualmente o ID da categoria já vem no DTO
        // então tem que adicionar um else para caso o ID não existir caso ao contrario será salvo um id inexistente
        Produto produto = ProdutoRequestDTO.toEntity(dto);

        return produtoRepository.save(produto);
    }

    public Produto atualizar(ProdutoRequestDTO dto, UUID produtoId){
        // Adicionar validação extra caso o produto não exista
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setNome(dto.nome());
        produto.setSabor(dto.sabor());
        produto.setPreco(dto.preco());
        produto.setCategoriaId(dto.categoriaId());

        return produto;
    }

    public Produto buscarPorId(UUID produtoId){
        // Adicionar validação extra caso o produto não exista
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        return produto;
    }

    public List<Produto> listarProdutos(){
        return produtoRepository.findAll();
    }

    public void deletar(UUID produtoId){
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produtoRepository.delete(produto);
    }
}
