import Duvida from "$model/Duvida";
import type { EnumVisibilidadeDuvida } from "$model/EnumVisibilidadeDuvida";
import Api from "./axiosInstance";

class DuvidaRepository {
    async PegarDuvidasPorProjeto(idProjeto: number) {
        const response = await Api.get(`duvidas/duvidasPorProjeto?idProjeto=${idProjeto}`)
            .catch((error) => {
                throw new Error(error);
            });

        const duvidas = response.map(Duvida.CriaDeDados);

        return duvidas;
    }

    async AdicionarDuvida(
        idProjeto: number,
        idUsuario: number,
        texto: string,
        visibilidade: EnumVisibilidadeDuvida,
    ) {
        const data = {
            idProjeto: idProjeto,
            idUsuario: idUsuario,
            texto: texto,
            visibilidade: visibilidade,
        }

        const response = await Api.post(`duvidas/criarDuvida`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarDuvida(
        id: number,
        idProjeto: number,
        idUsuario: number,
        texto: string,
        visibilidade: EnumVisibilidadeDuvida,
    ) {
        const data = {
            id: id,
            idProjeto: idProjeto,
            idUsuario: idUsuario,
            texto: texto,
            visibilidade: visibilidade,
        }

        const response = await Api.post(`duvidas/atualizarDuvida`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new DuvidaRepository();