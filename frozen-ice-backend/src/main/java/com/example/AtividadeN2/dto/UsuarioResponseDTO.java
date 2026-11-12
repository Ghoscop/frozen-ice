package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Usuario;

import java.util.UUID;
import java.time.LocalDateTime;

public record UsuarioResponseDTO(
        UUID id,
        String nome,
        String email,
        LocalDateTime dataCadastro
) {
    public static UsuarioResponseDTO toDto(Usuario usuario){
        return new UsuarioResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getDataCadastro()
        );
    }
}
