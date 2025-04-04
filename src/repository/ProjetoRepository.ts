import type { EnumPapel } from "$model/EnumPapel";
import type { EnumTipoFiltro } from "$model/EnumTipoFiltro";
import type { EnumTipoOrdenacao } from "$model/EnumTipoOrdenacao";
import Projeto from "$model/Projeto";
import Api from "./axiosInstance";

class ProjetoRepository {
    async PegarPorId(id: number): Promise<Projeto> {
        const response = await Api.get(`projetos/${id}`);

        const projeto = Projeto.CriaDeDados(response);

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
}

export default new ProjetoRepository();