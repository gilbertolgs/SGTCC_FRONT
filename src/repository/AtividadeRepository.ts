import Atividade from "$model/Atividade";
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
}

export default new AtividadeRepository();