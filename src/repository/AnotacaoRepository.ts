import Anotacao from "$model/Anotacao";
import Api from "./axiosInstance";

class AnotacaoRepository {
    async PegarAnotacoesPorProjeto(idProjeto: number) {
        const response = await Api.get(`anotacoes/buscarPorProjeto?id=${idProjeto}`)
            .catch((error) => {
                throw new Error(error);
            });

        const anotacoes = response.map(Anotacao.CriaDeDados);

        return anotacoes;
    }

    async AdicionarAnotacao(idUsuario: number,
        idProjeto: number,
        titulo: string,
        descricao: string) {
        const data = {
            idUsuario: idUsuario,
            idProjeto: idProjeto,
            titulo: titulo,
            descricao: descricao
        }

        const response = await Api.post(`anotacoes/criarAnotacao`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarAnotacao(idAnotacao: number, idUsuario: number, idProjeto: number, titulo: string, descricao: string) {
        const data = {
            id: idAnotacao,
            idUsuario: idUsuario,
            idProjeto: idProjeto,
            titulo: titulo,
            descricao: descricao
        }

        const response = await Api.put(`anotacoes/atualizarAnotacao`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async DeletarAnotacao(idAnotacao: number) {
        const response = await Api.delete(`anotacoes/deletarAnotacao?id=${idAnotacao}`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new AnotacaoRepository();