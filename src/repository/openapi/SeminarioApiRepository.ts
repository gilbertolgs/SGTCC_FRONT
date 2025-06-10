import openApiClient from "./openApiInstance";

class SeminarioApiRepository {
    /* ------------ Seminario ------------ */
    async CriarSeminario(idUsuario: number, requisitos: string, dataRealizacao: string) {
        const body = {
            idUsuario: idUsuario,
            requisitos: requisitos,
            data: dataRealizacao,
        }
        const { data, error } = await openApiClient.POST("/api/seminario/criarSeminario", {
            body: body,
        });

        if (error || !data) throw new Error("Erro ao criar seminário.");
        return data;
    }

    async AtualizarSeminario(id: number, idUsuario: number, requisitos: string, dataRealizacao: string) {
        const body = {
            id: id,
            idUsuario: idUsuario,
            requisitos: requisitos,
            data: dataRealizacao,
        }
        const { data, error } = await openApiClient.PUT("/api/seminario/atualizarSeminario", {
            body: body,
        });

        if (error || !data) throw new Error("Erro ao atualizar seminário.");
        return data;
    }

    async FinalizarSeminario(id: number) {
        const { data, error } = await openApiClient.DELETE("/api/seminario/finalizarSeminario", {
            params: { query: { id } },
        });

        if (error || !data) throw new Error(`Erro ao finalizar seminário com ID ${id}.`);
        return data;
    }

    async PegarTodosSeminarios() {
        const { data, error } = await openApiClient.GET("/api/seminario");

        if (error || !data) throw new Error("Erro ao buscar seminários.");
        return data;
    }

    async PegarSeminarioPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/seminario/{id}", {
            params: { path: { id } },
        });

        if (error || !data) throw new Error(`Erro ao buscar seminário com ID ${id}.`);
        return data;
    }

    async BuscarTodosPorIdProjeto(idProjeto: number) {
        const { data, error } = await openApiClient.GET("/api/seminario/todosPorIdProjeto/{idProjeto}", {
            params: { path: { idProjeto } },
        });

        if (error || !data) throw new Error(`Erro ao buscar seminários do projeto com ID ${idProjeto}.`);
        return data;
    }

    /* ------------ SeminarioProjeto ------------ */
    async CriarSeminarioProjeto(idSeminario: number, idProjeto: number) {
        const body = {
            idSeminario: idSeminario,
            idProjeto: idProjeto
        }
        const { data, error } = await openApiClient.POST("/api/seminarioProjeto/criarSeminarioProjeto", {
            body: body,
        });

        if (error || !data) throw new Error("Erro ao criar seminário-projeto.");
        return data;
    }

    async AtualizarSeminarioProjeto(id: number, idSeminario: number, idProjeto: number) {
        const body = {
            id: id,
            idSeminario: idSeminario,
            idProjeto: idProjeto
        }
        const { data, error } = await openApiClient.PUT("/api/seminarioProjeto/atualizarSeminarioProjeto", {
            body: body,
        });

        if (error || !data) throw new Error("Erro ao atualizar seminário-projeto.");
        return data;
    }

    async RemoverProjetoDoSeminario(idSeminario: number, idProjeto: number) {
        const { data, error } = await openApiClient.DELETE("/api/seminarioProjeto/removerProjetoDoSeminario", {
            params: { query: { idSeminario, idProjeto } },
        });

        if (error || !data) throw new Error("Erro ao remover projeto do seminário.");
        return data;
    }

    async PegarTodosSeminarioProjeto() {
        const { data, error } = await openApiClient.GET("/api/seminarioProjeto");

        if (error || !data) throw new Error("Erro ao buscar todos os seminário-projetos.");
        return data;
    }

    async PegarSeminarioProjetoPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/seminarioProjeto/{id}", {
            params: { path: { id } },
        });

        if (error || !data) throw new Error(`Erro ao buscar seminário-projeto com ID ${id}.`);
        return data;
    }

    async PegarProjetosPorSeminario(idSeminario: number) {
        const { data, error } = await openApiClient.GET("/api/seminarioProjeto/{idSeminario}/projetos", {
            params: { path: { idSeminario } },
        });

        if (error || !data) throw new Error(`Erro ao buscar projetos do seminário com ID ${idSeminario}.`);
        return data;
    }
}

export default new SeminarioApiRepository();