package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Categoria;
import com.example.AtividadeN2.entity.Produto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoResponseDTO(
            UUID id,
            String nome,
            BigDecimal preco,
            String sabor,
            UUID categoria
){
    public static ProdutoResponseDTO toDto(Produto produto){
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getSabor(),
                produto.getCategoriaId()
                );
    }
}
