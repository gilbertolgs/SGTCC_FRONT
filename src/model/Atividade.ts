import type { EnumAtividade } from "./EnumAtividade";
import { EnumPrioridadeAtividade } from "./EnumPrioridadeAtividade";

class Atividade {
  id: number;
  idProjeto: number;
  nome: string;
  descricao: string | null;
  estado: EnumAtividade;
  idUsuario: number;
  prioridade: EnumPrioridadeAtividade;
  duracaoEstimada: number;
  dataInicio: string;
  dataEntrega: string | null;

  constructor(
    id: number,
    idProjeto: number,
    nome: string,
    descricao: string | null,
    estado: EnumAtividade,
    idUsuario: number,
    prioridade: EnumPrioridadeAtividade,
    duracaoEstimada: number,
    dataInicio: string,
    dataEntrega: string | null
  ) {
    this.id = id;
    this.idProjeto = idProjeto;
    this.nome = nome;
    this.descricao = descricao;
    this.estado = estado;
    this.idUsuario = idUsuario;
    this.prioridade = prioridade;
    this.duracaoEstimada = duracaoEstimada;
    this.dataInicio = dataInicio;
    this.dataEntrega = dataEntrega;
  }

  CorPrioridade() {
    switch (this.prioridade) {
      case EnumPrioridadeAtividade.Baixa:
        return 'success'
      case EnumPrioridadeAtividade.Media:
        return 'warning'
      case EnumPrioridadeAtividade.Alta:
        return 'error'
      default:
        return 'success'
    }
  }

  static CriaDeDados(data: Atividade): Atividade {
    return new Atividade(
      data.id,
      data.idProjeto,
      data.nome,
      data.descricao,
      data.estado,
      data.idUsuario,
      data.prioridade,
      data.duracaoEstimada,
      data.dataInicio,
      data.dataEntrega
    );
  }
}


export default Atividade;