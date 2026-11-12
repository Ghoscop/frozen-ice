package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Produto;
import com.example.AtividadeN2.entity.Usuario;
import com.example.AtividadeN2.entity.Venda;
import tools.jackson.databind.ser.jdk.UUIDSerializer;

import java.math.BigDecimal;
import java.util.UUID;

public record VendaResponseDTO(
        UUID id,
        String formaPagamento,
        BigDecimal valorTotal,
        String status,
        UUID usuarioId,
        UUID produtoId
) {
    public static VendaResponseDTO toDto(Venda venda){
        return new VendaResponseDTO(
                venda.getId(),
                venda.getFormaPagamento(),
                venda.getValorTotal(),
                venda.getStatus(),
                venda.getUsuarioId(),
                venda.getProdutoId()
        );
    }
}
