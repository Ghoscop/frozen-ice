package com.example.AtividadeN2.repository;

import com.example.AtividadeN2.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoriaRepository extends JpaRepository<Categoria, UUID>{
}
