import Atividade from "$model/Atividade";
import Comentario from "$model/Comentario";
import ComentarioAtividade from "$model/ComentarioAtividade";
import type { EnumAtividade } from "$model/EnumAtividade";
import Api from "./axiosInstance";

class AtividadeRepository {
    async PegarAtividades(idProjeto: number) {
        const response = await Api.get(`atividade/projetos/${idProjeto}/atividades/semFiltro`)
            .catch((error) => {
                throw new Error(error);
            });

        const atividades = response.map(Atividade.CriaDeDados);

        return atividades;
    }

    async AdicionarAtividade(idProjeto: number, nome: string, descricao: string) {
        const data = {
            idProjeto: idProjeto,
            nome: nome,
            descricao: descricao
        }

        const response = await Api.post(`atividade/criarAtividade`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarAtividade(idProjeto: number, idAtividade: number, nome: string, descricao: string) {
        const data = {
            idProjeto: idProjeto,
            idAtividade: idAtividade,
            nome: nome,
            descricao: descricao
        }

        const response = await Api.post(`atividade/atualizarAtividade`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarStatusAtividade(idAtividade: number, estado: EnumAtividade) {
        const response = await Api.put(`atividade/${idAtividade}/status/${estado}`, null)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async PegarAtividadePorId(idAtividade: number) {
        const response = await Api.get(`atividade/${idAtividade}`)
            .catch((error) => {
                throw new Error(error);
            });

        const atividade = Atividade.CriaDeDados(response);

        return atividade;
    }

    async ExcluirAtividade(idAtividade: number) {
        const response = await Api.delete(`atividade/${idAtividade}/deletarAtividades`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async PegarComentariosAtividade(idAtividade: number) {
        const response = await Api.get(`atividadeComentarios/projetoAtividade/${idAtividade}/comentarios`)
            .catch((error) => {
                throw new Error(error);
            });

        const comentario = response.map(ComentarioAtividade.CriaDeDados);

        return comentario;
    }
    async AdicionarComentario(idUsuario: number, idAtividade: number, comentario: string) {
        const data = {
            idUsuario: idUsuario,
            idAtividade: idAtividade,
            comentario: comentario
        }

        const response = await Api.post(`atividadeComentarios/criarComentarioAtividade`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
    async ExcluirComentario(idComentario: number) {
        const response = await Api.delete(`atividadeComentarios/${idComentario}/deletarComentarioAtividade`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new AtividadeRepository();