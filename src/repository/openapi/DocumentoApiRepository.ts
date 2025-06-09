import { number } from "zod";
import openApiClient from "./openApiInstance";

class DocumentoApiRepository {
    async Criar(nome: string, idCategoria: number) {
        const body = {
            campo: nome,
            idCategoria: idCategoria
        };
        const { data, error } = await openApiClient.POST("/api/campoDocumentoAvaliacao/criarCamposDoc", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao criar campo de documento.");

        return data;
    }

    async Atualizar(id: number, nome: string, idCategoria: number) {
        const body = {
            id: id,
            campo: nome,
            idCategoria: idCategoria
        };
        const { data, error } = await openApiClient.PUT("/api/campoDocumentoAvaliacao/atualizarCampo", {
            body: body
        });

        if (error) throw new Error("Erro ao criar campo de documento.");

        return data;
    }

    async PegarTodos() {
        const { data, error } = await openApiClient.GET("/api/campoDocumentoAvaliacao");

        if (error || !data) throw new Error("Erro ao buscar todos os campos de documento.");

        return data;
    }

    async PegarPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/campoDocumentoAvaliacao/{id}/buscarPorId", {
            params: { path: { id: id } }
        });

        if (error || !data) throw new Error(`Erro ao buscar campo de documento com ID ${id}.`);

        return data;
    }

    async PegarPorCategoria(id: number) {
        const { data, error } = await openApiClient.GET("/api/campoDocumentoAvaliacao/porCategoria/{idCategoria}", {
            params: { path: { idCategoria: id } }
        });

        if (error || !data) throw new Error(`Erro ao buscar campos por categoria com ID ${id}.`);

        return data;
    }

    async Apagar(id: number) {
        const { data, error } = await openApiClient.DELETE("/api/campoDocumentoAvaliacao/{id}/deletarCampo", {
            params: { path: { id: id.toString() } },
            body: { id: id }
        });

        if (error) throw new Error(`Erro ao buscar categoria de documento com ID ${id}.`);

        return data;
    }

    /* ------------ Categoria ------------ */
    async CriarCategoria(nome: string) {
        const body = {
            valor: nome
        };
        const { data, error } = await openApiClient.POST("/api/categoriasDocumento/criarCategoria", {
            body: body
        });

        if (error || !data) throw new Error("Erro ao criar categoria de documento.");

        return data;
    }

    async AtualizarCategoria(id: number, nome: string) {
        const body = {
            id: id,
            valor: nome
        };
        const { data, error } = await openApiClient.PUT("/api/categoriasDocumento/atualizarCategoria", {
            body: body
        });

        if (error) throw new Error("Erro ao atualizar categoria de documento.");

        return data;
    }

    async PegarCategorias() {
        const { data, error } = await openApiClient.GET("/api/categoriasDocumento");

        if (error || !data) throw new Error("Erro ao buscar categorias de documento.");

        return data;
    }

    async PegarCategoriaPorId(id: number) {
        const { data, error } = await openApiClient.GET("/api/categoriasDocumento/{id}/buscarPorId", {
            params: { path: { id: id } }
        });

        if (error || !data) throw new Error(`Erro ao buscar categoria de documento com ID ${id}.`);

        return data;
    }

    async ApagarCategoria(id: number) {
        const campos: any[] | never = await this.PegarPorCategoria(id);

        if (campos && campos.length > 0) {
            campos.forEach(async campo => {
                await this.Apagar(campo.id);
            });
        }
        const { data, error } = await openApiClient.DELETE("/api/categoriasDocumento/{id}/deletarCategoria", {
            params: { path: { id: id } },
        });

        if (error) throw new Error(`Erro ao buscar categoria de documento com ID ${id}.`);

        return data;
    }
    /* ------------ Categoria ------------ */
}

export default new DocumentoApiRepository();
