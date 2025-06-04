import type { EnumTipoNota } from "$model/EnumTipoNota";
import openApiClient from "./openApiInstance";

class NotaApiRepository {
    /* ------------ Nota Documento Aluno ------------ */
    async PegarTodasNotasDocumentoAluno() {
        const { data, error } = await openApiClient.GET("/api/notaDocumentoAluno");

        if (error || !data) throw new Error("Erro ao buscar notas de documento de aluno.");
        return data;
    }

    async PegarNotaDocumentoAlunoPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/notaDocumentoAluno/{id}", {
            params: { path: { id } }
        });

        if (error || !data) throw new Error(`Erro ao buscar nota de documento com ID ${id}.`);
        return data;
    }

    async CriarNotaDocumentoAluno(idAvaliadorBanca: number, idCampo: number, idAluno: number, nota: number, tipo: EnumTipoNota) {
        const body = {
            idAvaliadorBanca: idAvaliadorBanca,
            idCampo: idCampo,
            idAluno: idAluno,
            nota: nota,
            tipo: tipo
        }
        const { data, error } = await openApiClient.POST("/api/notaDocumentoAluno/criarNotaDocumento", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao criar nota de documento do aluno.");
        return data;
    }

    async AtualizarNotaDocumentoAluno(id: number, idAvaliadorBanca: number, idCampo: number, idAluno: number, nota: number, tipo: EnumTipoNota) {
        const body = {
            id: id,
            idAvaliadorBanca: idAvaliadorBanca,
            idCampo: idCampo,
            idAluno: idAluno,
            nota: nota,
            tipo: tipo
        }
        const { data, error } = await openApiClient.PUT("/api/notaDocumentoAluno/atualizarNotaDocumento", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao atualizar nota de documento do aluno.");
        return data;
    }

    async DeletarNotaDocumentoAluno(id: number) {
        const idPath = id.toString();
        const body = {
            id: id
        }
        const { data, error } = await openApiClient.DELETE("/api/notaDocumentoAluno/{id}/deletarNotaDocumento", {
            params: { path: { id: idPath } },
            body: body
        });

        if (error) throw new Error(`Erro ao deletar nota de documento do aluno com ID ${id}.`);
        return data;
    }

    /* ------------ Nota Final Aluno ------------ */
    async PegarTodasNotasFinaisAluno() {
        const { data, error } = await openApiClient.GET("/api/notaFinalAluno");

        if (error || !data) throw new Error("Erro ao buscar notas finais de aluno.");
        return data;
    }

    async PegarNotaFinalAlunoPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/notaFinalAluno/{id}", {
            params: { path: { id } }
        });

        if (error || !data) throw new Error(`Erro ao buscar nota final com ID ${id}.`);
        return data;
    }

    async CriarNotaFinalAluno(idAvaliadorBanca: number, idAluno: number, nota: number) {
        const body = {
            idAvaliadorBanca: idAvaliadorBanca,
            idAluno: idAluno,
            nota: nota
        }
        const { data, error } = await openApiClient.POST("/api/notaFinalAluno/criarNotaFinal", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao criar nota final do aluno.");
        return data;
    }

    async AtualizarNotaFinalAluno(id: number, idAvaliadorBanca: number, idAluno: number, nota: number) {
        const body = {
            id: id,
            idAvaliadorBanca: idAvaliadorBanca,
            idAluno: idAluno,
            nota: nota
        }
        const { data, error } = await openApiClient.PUT("/api/notaFinalAluno/atualizarNotaFinal", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao atualizar nota final do aluno.");
        return data;
    }

    async DeletarNotaFinalAluno(id: number) {
        const idPath = id.toString();
        const body = {
            id: id
        }
        const { data, error } = await openApiClient.DELETE("/api/notaFinalAluno/{id}/deletarNotaFinal", {
            params: { path: { id: idPath } },
            body: body
        });

        if (error) throw new Error(`Erro ao deletar nota final do aluno com ID ${id}.`);
        return data;
    }
}

export default new NotaApiRepository();
