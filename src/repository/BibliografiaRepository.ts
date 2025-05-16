import Bibliografia from "$model/Bibliografia";
import Api from "./axiosInstance";

class BibliografiaRepository {
    async PegarBibliografiaPorProjeto(idProjeto: number) {
        const response = await Api.get(`bibligrafia/bibliografiaPorProjeto?idProjeto=${idProjeto}`)
            .catch((error) => {
                throw new Error(error);
            });

        const bibliografias = response.map(Bibliografia.CriaDeDados);

        return bibliografias;
    }

    async AdicionarBibliografia(
        idUsuario: number,
        idProjeto: number,
        autores: string,
        referencia: string,
        acessadoEm: string
    ) {
        const data = {
            idUsuario: idUsuario,
            idProjeto: idProjeto,
            autores: autores,
            referencia: referencia,
            acessadoEm: acessadoEm
        }

        const response = await Api.post(`bibligrafia/criarBibliografia`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarBibliografia(
        id: number,
        idUsuario: number,
        idProjeto: number,
        autores: string,
        referencia: string,
        acessadoEm: string
    ) {
        const data = {
            id: id,
            idUsuario: idUsuario,
            idProjeto: idProjeto,
            autores: autores,
            referencia: referencia,
            acessadoEm: acessadoEm
        }

        const response = await Api.post(`bibligrafia/atualizarBibliografia`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }
}

export default new BibliografiaRepository();