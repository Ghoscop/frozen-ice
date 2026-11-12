package com.example.AtividadeN2.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String formaPagamento;
    private BigDecimal valorTotal;
    private String status;

    @ManyToOne()
    private UUID usuarioId;

    @ManyToOne()
    private UUID produtoId;
}
