import FileHandler from "$lib/FileHandler";
import { textoEnumPapel, type EnumPapel } from "./EnumPapel";
import Imagem from "./Imagem";

class Usuario {
  id: number;
  idCurso: number;
  nome: string;
  email: string;
  senha: string;
  papel: EnumPapel;
  imagem: Imagem | null;
  nomeCurso: string | null;

  ExibeImagem() {
    return FileHandler.ExibeImagem(this.imagem);
  }

  ExibePapel() {
    return textoEnumPapel[this.papel];
  }

  constructor(
    id: number,
    idCurso: number,
    nome: string,
    email: string,
    senha: string,
    papel: EnumPapel,
    imagem: Imagem | null = null,
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

  static CriaDeDados(data: Usuario): Usuario {
    return new Usuario(data.id, data.idCurso, data.nome, data.email, data.senha, data.papel, data.imagem, data.nomeCurso);
  }
}

export default Usuario