package com.example.AtividadeN2.repository;

import com.example.AtividadeN2.entity.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VendaRepository extends  JpaRepository<Venda, UUID> {
}
