class Anotacao {

  id: number;
  idUsuario: number;
  idProjeto: number;
  titulo: string;
  descricao: string;
  criadoEm: string;

  nomeUsuario: string | undefined;


  constructor(
    id: number,
    idUsuario: number,
    idProjeto: number,
    titulo: string,
    descricao: string,
    criadoEm: string,
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idProjeto = idProjeto;
    this.titulo = titulo;
    this.descricao = descricao;
    this.criadoEm = criadoEm;
  }

  static CriaDeDados(data: Anotacao): Anotacao {
    return new Anotacao(
      data.id,
      data.idUsuario,
      data.idProjeto,
      data.titulo,
      data.descricao,
      data.criadoEm,
    );
  }
}


export default Anotacao;