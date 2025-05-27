import Api from "./axiosInstance";

class RelatorioRepository {
    async PegarTodosRelatorios() {
        const response = await Api.get("relatorios")
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async PegarRelatorioPorId(id: number) {
        const response = await Api.get(`relatorios/${id}`)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async BuscarRelatorioPorUsuario(idUsuario: number) {
        const response = await Api.get(`relatorios/buscarRelatorioPorUsuario`, {
            params: { idUsuario }
        }).catch((error) => {
            throw new Error(error);
        });

        return response;
    }

    async BuscarRelatorioPorProjeto(idProjeto: number) {
        const response = await Api.get(`relatorios/buscarRelatorioPorProjeto?idProjeto=${idProjeto}`, {

        }).catch((error) => {
            throw new Error(error);
        });

        return response;
    }

    async CriarRelatorio(
        idProfessor: number,
        idProjeto: number,
        titulo: string | null,
        descricao: string | null,
        duracaoEncontro: number,
        dataRealizacao: string
    ) {
        const data = {
            idProfessor: idProfessor,
            idProjeto: idProjeto,
            titulo: titulo,
            descricao: descricao,
            duracaoEncontro: duracaoEncontro,
            dataRealizacao: dataRealizacao
        };

        const response = await Api.post(`relatorios/criarRelatorio`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async AtualizarRelatorio(
        id: number,
        idProfessor: number,
        idProjeto: number,
        titulo: string | null,
        descricao: string | null,
        duracaoEncontro: number,
        dataRealizacao: string
    ) {
        const data = {
            id,
            idProfessor,
            idProjeto,
            titulo,
            descricao,
            duracaoEncontro,
            dataRealizacao
        };

        const response = await Api.put(`relatorios/atualizarRelatorio`, data)
            .catch((error) => {
                throw new Error(error);
            });

        return response;
    }

    async DeletarRelatorio(id: number) {
        const response = await Api.delete(`relatorios/deletarRelatorio?id=${id}`, {
        }).catch((error) => {
            throw new Error(error);
        });

        return response;
    }

    async GerarPdfRelatorio(idRelatorio: number) {
        const response = await Api.getBlob(`relatorios/GerarPdfRelatorio?idRelatorio=${idRelatorio}`, {
        }).catch((error) => {
            throw new Error(error);
        });

        return response;
    }
}

export default new RelatorioRepository();
