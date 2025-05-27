import FileHandler from "$lib/FileHandler";
import { textoEnumEstadoProjeto, type EnumEstadoProjeto } from "./EnumEstadoProjeto";
import type Imagem from "./Imagem";
import Tag from "./Tag";
import Usuario from "./Usuario";

class Proposta {
  id: number;
  idProjeto: number;
  nomeProjeto: string;
  descricaoProjeto: string;
  justificativaProjeto: string;
  atividadesPropostas: string;
  contribuicaoAgenda: string;
  sugestao: string;
  parecer: number;
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
    parecer: number,
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