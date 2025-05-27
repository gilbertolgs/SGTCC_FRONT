import type { EnumParecerProposta } from "$model/EnumParecerProposta";
import Proposta from "$model/Proposta";
import Api from "./axiosInstance";

class PropostaRepository {
    async PegarPorId(id: number): Promise<Proposta> {
        const response = await Api.get(`propostas/${id}`);

        const proposta = Proposta.CriaDeDados(response);

        return proposta;
    }

    async PegarPorIdCurso(idCurso: number): Promise<Proposta[]> {
        const response = await Api.get(`propostas/porCurso/${idCurso}`);

        const proposta = response.map(Proposta.CriaDeDados);

        return proposta;
    }

    async PegarPorIdProjeto(idProjeto: number): Promise<Proposta> {
        const response = await Api.get(`propostas/buscarPropostaPorProjeto?idProjeto=${idProjeto}`);

        const proposta = Proposta.CriaDeDados(response);

        return proposta;
    }

    async CriarProposta(
        idProjeto: number,
        atividadesPropostas: string,
        contribuicaoAgenda: string,
        sugestao: string,
    ) {
        const data = {
            idProjeto: idProjeto,
            atividadesPropostas: atividadesPropostas,
            contribuicaoAgenda: contribuicaoAgenda,
            sugestao: sugestao,
        };

        const response = await Api.post(`propostas/criarProposta`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AlterarProposta(idProposta: number, nome: string, descricao: string, justificativa: string, tags: string[]) {
        const data = {
            id: idProposta,
            nome: nome,
            descricao: descricao,
            justificativa: justificativa,
            tags: tags.map(tag => ({ nome: tag }))
        };

        const response = await Api.put(`propostas/${idProposta}/atualizarProposta`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async Parecer(idProposta: number, parecer: EnumParecerProposta) {
        const response = await Api.put(`propostas/parecer?id=${idProposta}&parecer=${parecer}`, null)
            .catch((error) => {
                throw new Error(error);
            });

        return response;

    }
}

export default new PropostaRepository();