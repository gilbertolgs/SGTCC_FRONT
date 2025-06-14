import Convite from "$model/Convite";
import type { EnumConvite } from "$model/EnumConvite";
import type { EnumPapel } from "$model/EnumPapel";
import LoggedUser from "$model/LoggedUser";
import Usuario from "$model/Usuario";
import Api from "./axiosInstance";

class UsuarioRepository {
    async Login(email: string, senha: string): Promise<LoggedUser> {
        const login: LoggedUser = await Api.post("usuarios/login", {
            email: email,
            senha: senha,
        }).catch((error) => {
            console.log(error);
            return null;
        });

        return login;
    }

    async PegarPorEmail(email: string): Promise<Usuario> {
        const usuario: Usuario = await Api.get("usuarios/email", {
            email: email,
        });

        return usuario;
    }

    async PegarPorEmailLogin(email: string): Promise<LoggedUser> {
        const response = await Api.get("usuarios/email", {
            email: email,
        });

        const usuario = new LoggedUser(response.id, response.idCurso, response.nome, response.email, '', response.papel, response.imagem, response.token);

        return usuario;
    }

    async PegarPorId(id: number): Promise<Usuario> {
        const response = await Api.get(`usuarios/${id}`);

        // const usuario = new Usuario(
        //     response.id, response.idCurso, response.nome, response.email, "", response.papel, response.imagem, response.nomeCurso
        // );
        const usuario = Usuario.CriaDeDados(response);

        return usuario;
    }

    async PegarTodosPorPapel(papel: EnumPapel): Promise<Usuario[]> {
        const params = {
            papel: papel
        }
        const response = await Api.get(`usuarios/usuarioPorPapel`, params);

        const usuario = response.map(Usuario.CriaDeDados);

        return usuario;
    }

    async PegarTodosPorProjeto(idProjeto: number): Promise<Usuario[]> {
        const response = await Api.get(`usuarios/${idProjeto}/usuarioPorProjeto/semFiltro`);

        const transformed = response.map(({ idUsuario, ...rest }: { idUsuario: number, id?: any, [key: string]: any }) => ({
            ...rest,
            id: idUsuario,
        }));


        const usuario = transformed.map(Usuario.CriaDeDados);

        return usuario;
    }

    async PegarTodosConvites(idUsuario: number): Promise<Convite[]> {
        const response = await Api.get(`usuariosProjeto/convitesUsuario/${idUsuario}`);

        const convites = response.map(Convite.CriaDeDados);

        return response;
    }

    async CriarUsuario(idCurso: number, nome: string, email: string, senha: string, papel: EnumPapel) {
        const data = {
            "idCurso": idCurso,
            "nome": nome,
            "email": email,
            "senha": senha,
            "papel": papel,
        }
        const response = await Api.post(`usuarios/criarUsuario`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarUsuario(id: number, nome: string, email: string) {
        const data = {
            id: id,
            nome: nome,
            email: email
        };

        const response = await Api.put(`/usuarios/atualizarUsuario`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AlterarImagem(idUsuario: number, imagem: Blob, nomeImagem: string) {
        const formData = new FormData();

        // const responseImage = await fetch(imagem);
        // const imagemBlob = await responseImage.blob();

        formData.append('file', imagem, nomeImagem);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await Api.post(`usuarios/alterarImagem?idUsuario=${idUsuario}`, formData, config)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async ResponderConvite(idConvite: number, resposta: EnumConvite) {
        const data = {
            idConvite: idConvite,
            resposta: resposta
        }

        const response = await Api.post(`usuariosProjeto/responderConviteProjeto`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new UsuarioRepository();