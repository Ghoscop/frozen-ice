package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Categoria;
import com.example.AtividadeN2.entity.Produto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoRequestDTO(
    String nome,
    BigDecimal preco,
    String sabor,
    UUID categoriaId
){
    public static Produto toEntity(ProdutoRequestDTO dto) {
        Produto produto = new Produto();

        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setSabor(dto.sabor());
        produto.setCategoriaId(dto.categoriaId());

        return produto;
    }
}
