class Convite {
  id: number;
  idUsuario: number;
  nome: string;
  email: string;
  papel: number;
  funcao: number;
  estado: number;
  nomeProjeto: string;

  constructor(
    id: number,
    idUsuario: number,
    nome: string,
    email: string,
    papel: number,
    funcao: number,
    estado: number,
    nomeProjeto: string
  ) {
    this.id = id;
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.email = email;
    this.papel = papel;
    this.funcao = funcao;
    this.estado = estado;
    this.nomeProjeto = nomeProjeto;
  }

  static CriaDeDados(data: Convite): Convite {
    return new Convite(
      data.id,
      data.idUsuario,
      data.nome,
      data.email,
      data.papel,
      data.funcao,
      data.estado,
      data.nomeProjeto
    );
  }
}

export default Convite