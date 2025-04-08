import Atividade from "$model/Atividade";
import { EnumFuncaoUsuario } from "$model/EnumFuncaoUsuario";
import { EnumPapel } from "$model/EnumPapel";
import type { EnumTipoFiltro } from "$model/EnumTipoFiltro";
import type { EnumTipoOrdenacao } from "$model/EnumTipoOrdenacao";
import Projeto from "$model/Projeto";
import type Usuario from "$model/Usuario";
import Api from "./axiosInstance";

class ProjetoRepository {
    async PegarPorId(id: number): Promise<Projeto> {
        const response = await Api.get(`projetos/${id}`);

        const projeto = Projeto.CriaDeDados(response);

        return projeto;
    }

    async PegarPendentes(): Promise<Projeto[]> {
        const response = await Api.get(`projetos/pendente`);

        const projeto = response.map(Projeto.CriaDeDados);

        return projeto;
    }

    async PegarTodosPorIdUsuario(idUsuario: number): Promise<Projeto[]> {
        const response = await Api.get(`projetos/porUsuario/${idUsuario}`);

        const projeto = response.map(Projeto.CriaDeDados);

        return projeto;
    }

    async PegarTodosPorFiltro(tipoFiltro: EnumTipoFiltro, filtro: string, tipoOrdenacao: EnumTipoOrdenacao, ano: number): Promise<Projeto[]> {
        const params = {
            tipoFiltro: tipoFiltro,
            filtro: filtro,
            tipoOrdenacao: tipoOrdenacao,
            ano: ano
        }
        const response = await Api.get(`projetos/filtroGeral`, params);

        const projeto = response.map(Projeto.CriaDeDados);

        return projeto;
    }

    async CriarProjeto(idUsuario: number, idCurso: number, nome: string, descricao: string, justificativa: string, tags: string[]) {
        const data = {
            idCurso: idCurso,
            idUsuario: idUsuario,
            nome: nome,
            descricao: descricao,
            justificativa: justificativa,
            funcao: 1, //WARN: Checar isso
            tags: tags.map(name => ({ nome: name }))
        };

        const response = await Api.post(`projetos/criarProjeto`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async TornarPublico(idProjeto: number) {
        const response = await Api.put(`projetos/${idProjeto}/tornarPublico`, null)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarUsuario(id: number, nome: string, email: string) {
        const data = {
            "nome": nome,
            "email": email
        };

        const response = await Api.put(`/usuarios/${id}/atualizarUsuario`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AlterarImagem(idProjeto: number, imagem: Blob, nomeImagem: string) {
        const formData = new FormData();

        formData.append('file', imagem, nomeImagem);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const response = await Api.post(`projetos/alterarImagem?idProjeto=${idProjeto}`, formData, config)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AdicionarUsuarioAoProjeto(idProjeto: number, emailUsuario: string) {
        const usuario: Usuario = await Api.get(`usuarios/email?email=${emailUsuario}`)
            .catch((error) => {
                throw new Error(error);
            });

        let funcaoUsuario = EnumFuncaoUsuario.Membro;
        if (usuario.papel === EnumPapel.Professor) {
            funcaoUsuario = EnumFuncaoUsuario.Orientador;
        }
        const data = {
            idUsuario: usuario.id,
            idProjeto: idProjeto,
            funcao: funcaoUsuario
        }

        const response = await Api.post(`usuariosProjeto/adicionarUsuarioNoProjeto`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async RemoverUsuarioAoProjeto(idProjeto: number, idUsuario: number) {
        const data = {
            idUsuario: idUsuario,
            idProjeto: idProjeto,
        }

        const response = await Api.delete(`usuariosProjeto/removerUsuarioDeProjeto`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async PegarAtividades(idProjeto: number) {
        const response = await Api.get(`atividade/projetos/${idProjeto}/atividades`)
            .catch((error) => {
                throw new Error(error);
            });

        const atividades = response.map(Atividade.CriaDeDados);

        return atividades;
    }

    async FinalizarProjeto(idProjeto: number) {
        const response = await Api.put(`projetos/${idProjeto}/finalizarProjeto`, null)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

}

export default new ProjetoRepository();