package com.example.AtividadeN2.service;

import com.example.AtividadeN2.dto.CategoriaRequestDTO;
import com.example.AtividadeN2.entity.Categoria;
import com.example.AtividadeN2.repository.CategoriaRepository;

public class CategoriaService {
    private CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public Categoria cadastrar(CategoriaRequestDTO dto){
        Categoria categoria = CategoriaRequestDTO.toEntity(dto);
        return categoria;
    }
}
