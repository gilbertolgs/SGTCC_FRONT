import openApiClient from "./openApiInstance";

class BancaApiRepository {
  /* ------------ Banca ------------ */
  async CriarBanca(payload: {
    idProjeto: number;
    dataSeminario: string;
    observacaoNotaProjeto?: string | null;
    observacaoAluno?: string | null;
    recomendacao?: string | null;
  }) {
    const { data, error } = await openApiClient.POST("/api/banca/criarBanca", {
      body: payload
    });

    if (error || !data) throw new Error("Erro ao criar banca.");
    return data;
  }

  async AtualizarBanca(payload: any) {
    const { data, error } = await openApiClient.PUT("/api/banca/atualizarBanca", {
      body: payload
    });

    if (error || !data) throw new Error("Erro ao atualizar banca.");
    return data;
  }

  async PegarTodasBancas() {
    const { data, error } = await openApiClient.GET("/api/banca");

    if (error || !data) throw new Error("Erro ao buscar bancas.");
    return data;
  }

  async PegarBancaPorId(id: number) {
    const { data, error } = await openApiClient.GET("/api/banca/{id}", {
      params: { path: { id } }
    });

    if (error || !data) throw new Error(`Erro ao buscar banca com ID ${id}.`);
    return data;
  }

  async DetalhesDaBanca(id: number) {
    const { data, error } = await openApiClient.GET("/api/banca/detalhesDaBanca", {
      params: { query: { id } }
    });

    if (error || !data) throw new Error(`Erro ao buscar detalhes da banca com ID ${id}.`);
    return data;
  }

  async BancasPorUsuario(idUsuario: number) {
    const { data, error } = await openApiClient.GET("/api/banca/bancasPorUsuario", {
      params: { query: { idUsuario } }
    });

    if (error || !data) throw new Error(`Erro ao buscar bancas para o usuário com ID ${idUsuario}.`);
    return data;
  }

  async DeletarBanca(id: number) {
    const { data, error } = await openApiClient.DELETE("/api/banca/deletarBanca", {
      params: { query: { id } }
    });

    if (error) throw new Error(`Erro ao deletar banca com ID ${id}.`);
    return data;
  }

  /* ------------ Avaliador Banca ------------ */
  async CriarAvaliador(payload: { idUsuario: number; idBanca: number }) {
    const { data, error } = await openApiClient.POST("/api/avaliadorBanca/CriarAvaliador", {
      body: payload
    });

    if (error || !data) throw new Error("Erro ao criar avaliador da banca.");
    return data;
  }

  async AtualizarAvaliador(payload: any) {
    const { data, error } = await openApiClient.PUT("/api/avaliadorBanca/atualizarBanca", {
      body: payload
    });

    if (error || !data) throw new Error("Erro ao atualizar avaliador da banca.");
    return data;
  }

  async BuscarProfessores() {
    const { data, error } = await openApiClient.GET("/api/avaliadorBanca/BuscarProfessores");

    if (error || !data) throw new Error("Erro ao buscar professores.");
    return data;
  }

  async BuscarTodosAvaliadores() {
    const { data, error } = await openApiClient.GET("/api/avaliadorBanca/BuscarTodos");

    if (error || !data) throw new Error("Erro ao buscar avaliadores.");
    return data;
  }

  async BuscarTodosAvaliadoresPorBanca(idBanca: number) {
    const { data, error } = await openApiClient.GET("/api/avaliadorBanca/BuscarTodosPorBanca/{idBanca}",
      { params: { path: { idBanca } } }
    );

    if (error || !data) throw new Error("Erro ao buscar avaliadores.");
    return data;
  }

  async BuscarAvaliadorPorId(id: number) {
    const { data, error } = await openApiClient.GET("/api/avaliadorBanca/{id}/buscarPorId", {
      params: { path: { id } }
    });

    if (error || !data) throw new Error(`Erro ao buscar avaliador da banca com ID ${id}.`);
    return data;
  }

  async DeletarAvaliador(id: number) {
    const idPath = id.toString();
    const body = {
      id: id
    }
    const { data, error } = await openApiClient.DELETE("/api/avaliadorBanca/{id}/deletarBanca", {
      params: { path: { id: idPath } },
      body: body
    });

    if (error) throw new Error(`Erro ao deletar avaliador da banca com ID ${idPath}.`);
    return data;
  }
}

export default new BancaApiRepository();
