class ComentarioAtividade {
  id: number;
  idUsuario: number;
  idAtividade: number;
  comentario: string;
  nomeUsuario: string;

  constructor(
    id: number,
    idUsuario: number,
    idAtividade: number,
    comentario: string,
    nomeUsuario: string
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.idAtividade = idAtividade;
    this.comentario = comentario;
    this.nomeUsuario = nomeUsuario;
  }

  static CriaDeDados(data: ComentarioAtividade): ComentarioAtividade {
    return new ComentarioAtividade(
      data.id,
      data.idUsuario,
      data.idAtividade,
      data.comentario,
      data.nomeUsuario
    );
  }
}


export default ComentarioAtividade;