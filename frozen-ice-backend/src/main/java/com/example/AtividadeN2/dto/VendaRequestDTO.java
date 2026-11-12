package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Produto;
import com.example.AtividadeN2.entity.Usuario;
import com.example.AtividadeN2.entity.Venda;

import java.math.BigDecimal;
import java.util.UUID;

public record VendaRequestDTO(
        String formaPagamento,
        BigDecimal valorTotal,
        String status,
        UUID usuario,
        UUID produto
) {
    public static Venda toEntity(VendaRequestDTO dto){
        Venda venda = new Venda();

        venda.setFormaPagamento(dto.formaPagamento());
        venda.setValorTotal(dto.valorTotal());
        venda.setStatus(dto.status());
        venda.setUsuarioId(dto.usuario());
        venda.setProdutoId(dto.produto());

        return venda;
    }
}
