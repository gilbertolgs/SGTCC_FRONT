class Relatorio {
  id: number;
  idProfessor: number;
  idProjeto: number;
  titulo: string | null;
  descricao: string | null;
  duracaoEncontro: number;
  dataRealizacao: string;
  criadoEm: string;
  nomeProfessor: string | null;
  nomeProjeto: string | null;

  constructor(
    id: number,
    idProfessor: number,
    idProjeto: number,
    titulo: string | null,
    descricao: string | null,
    duracaoEncontro: number,
    dataRealizacao: string,
    criadoEm: string,
    nomeProfessor: string | null = null,
    nomeProjeto: string | null = null
  ) {
    this.id = id;
    this.idProfessor = idProfessor;
    this.idProjeto = idProjeto;
    this.titulo = titulo;
    this.descricao = descricao;
    this.duracaoEncontro = duracaoEncontro;
    this.dataRealizacao = dataRealizacao;
    this.criadoEm = criadoEm;
    this.nomeProfessor = nomeProfessor;
    this.nomeProjeto = nomeProjeto;
  }

  static CriaDeDados(data: any): Relatorio {
    return new Relatorio(
      data.id,
      data.idProfessor,
      data.idProjeto,
      data.titulo?.trim() ?? null,
      data.descricao ?? null,
      data.duracaoEncontro,
      data.dataRealizacao,
      data.criadoEm,
      data.nomeProfessor ?? null,
      data.nomeProjeto ?? null
    );
  }
}

export default Relatorio;
