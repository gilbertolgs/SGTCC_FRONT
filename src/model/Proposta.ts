import type { EnumParecerProposta } from "./EnumParecerProposta";

class Proposta {
  id: number;
  idProjeto: number;
  nomeProjeto: string;
  descricaoProjeto: string;
  justificativaProjeto: string;
  atividadesPropostas: string;
  contribuicaoAgenda: string;
  sugestao: string;
  parecer: EnumParecerProposta;
  criadoEm: string;

  constructor(
    id: number,
    idProjeto: number,
    nomeProjeto: string,
    descricaoProjeto: string,
    justificativaProjeto: string,
    atividadesPropostas: string,
    contribuicaoAgenda: string,
    sugestao: string,
    parecer: EnumParecerProposta,
    criadoEm: string
  ) {
    this.id = id;
    this.idProjeto = idProjeto;
    this.nomeProjeto = nomeProjeto;
    this.descricaoProjeto = descricaoProjeto;
    this.justificativaProjeto = justificativaProjeto;
    this.atividadesPropostas = atividadesPropostas;
    this.contribuicaoAgenda = contribuicaoAgenda;
    this.sugestao = sugestao;
    this.parecer = parecer;
    this.criadoEm = criadoEm;
  }

  static CriaDeDados(data: Proposta): Proposta {
    return new Proposta(
      data.id,
      data.idProjeto,
      data.nomeProjeto,
      data.descricaoProjeto,
      data.justificativaProjeto,
      data.atividadesPropostas,
      data.contribuicaoAgenda,
      data.sugestao,
      data.parecer,
      data.criadoEm
    );
  }

}


export default Proposta;