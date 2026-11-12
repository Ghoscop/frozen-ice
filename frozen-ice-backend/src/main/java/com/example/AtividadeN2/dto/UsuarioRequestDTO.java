package com.example.AtividadeN2.dto;

import com.example.AtividadeN2.entity.Usuario;

public record UsuarioRequestDTO(
        String nome,
        String senha,
        String email
) {
    public static Usuario toEntity(UsuarioRequestDTO dto){
        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setSenha(dto.senha());
        usuario.setEmail(dto.email());
        return usuario;
    }
}
