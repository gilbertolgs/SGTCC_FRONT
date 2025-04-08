import type { EnumAtividade } from "./EnumAtividade";

class Atividade {
  id: number;
  idProjeto: number;
  nome: string;
  descricao: string;
  estado: EnumAtividade;

  constructor(
    id: number,
    idProjeto: number,
    nome: string,
    descricao: string,
    estado: EnumAtividade
  ) {
    this.id = id;
    this.idProjeto = idProjeto;
    this.nome = nome;
    this.descricao = descricao;
    this.estado = estado;
  }

  static CriaDeDados(data: Atividade): Atividade {
    return new Atividade(
      data.id,
      data.idProjeto,
      data.nome,
      data.descricao,
      data.estado,
    );
  }
}


export default Atividade;