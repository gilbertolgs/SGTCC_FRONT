import type { enumPapel } from "./EnumPapel";

class Usuario {
  id: number;
  idCurso: number;
  nome: string;
  email: string;
  senha: string;
  papel: enumPapel;
  imagem: string | null;
  nomeCurso: string | null;

  constructor(
    id: number,
    idCurso: number,
    nome: string,
    email: string,
    senha: string,
    papel: enumPapel,
    imagem: string | null = null,
    nomeCurso: string | null = null,
  ) {
    this.id = id;
    this.idCurso = idCurso;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.papel = papel;
    this.imagem = imagem;
    this.nomeCurso = nomeCurso;
  }
}

export default Usuario