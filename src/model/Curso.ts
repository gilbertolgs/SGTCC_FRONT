import FileHandler from "$lib/FileHandler";
import type Imagem from "./Imagem";

class Curso {
  id: number;
  nome: string;
  descricao: string;
  imagem: Imagem | null;

  constructor(id: number, nome: string, descricao: string, imagem: Imagem | null) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.imagem = imagem;
  }

  ExibeImagem() {
    return FileHandler.ExibeImagem(this.imagem);
  }


  static CriaDeDados(data: Curso): Curso {
    return new Curso(data.id, data.nome, data.descricao, data.imagem);
  }
}

export default Curso