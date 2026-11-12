package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Categoria;

public record CategoriaRequestDTO(
        String nome,
        String descricao,
        String tipo,
        Boolean status
) {
    public static Categoria toEntity(CategoriaRequestDTO dto){
        Categoria categoria = new Categoria();

        categoria.setNome(dto.nome());
        categoria.setDescricao(dto.descricao());
        categoria.setTipo(dto.tipo());
        categoria.setStatus(dto.status());

        return categoria;
    }
}
