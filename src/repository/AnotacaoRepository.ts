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

    async AdicionarAtividade(idProjeto: number, nome: string, descricao: string, idUsuario: number, duracaoEstimada: number, prioridade: number, dataInicio: string, dataEntrega: string) {
        const data = {
            idProjeto: idProjeto,
            idUsuario: idUsuario,
            nome: nome,
            descricao: descricao,
            duracaoEstimada: duracaoEstimada,
            prioridade: prioridade,
            dataInicio: dataInicio,
            dataEntrega: dataEntrega
        }

        const response = await Api.post(`atividade/criarAtividade`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new AnotacaoRepository();