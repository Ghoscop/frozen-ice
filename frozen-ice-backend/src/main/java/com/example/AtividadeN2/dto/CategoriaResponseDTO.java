package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Categoria;

import java.util.UUID;

public record CategoriaResponseDTO(
        UUID id,
        String nome,
        String descricao,
        String tipo,
        Boolean status
) {
    public static CategoriaResponseDTO toDto(Categoria categoria){
        return new CategoriaResponseDTO(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getTipo(),
                categoria.getStatus()
        );
    }
}
