import Seminario from "$model/Seminario";
import openApiClient from "./openApiInstance";

class SeminarioApiRepository {
    async PegarPorId(id: number): Promise<Seminario> {
        const { data, error } = await openApiClient.GET("/api/seminario/{id}", {
            params: { path: { id } }
        });

        if (error || !data) throw new Error("Erro ao buscar projeto");

        return Seminario.CriaDeDados(data);
    }
}

export default new SeminarioApiRepository();