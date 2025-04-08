import { EnumPapel } from "$model/EnumPapel";
import type Usuario from "$model/Usuario";

export class NavigationLinks {
    usuario: Usuario | null;
    constructor(usuario: Usuario | null) {
        this.usuario = usuario
    }

    PegarLinks() {
        if (this.usuario == null) {
            return this.LinksPadrao();
        }
        switch (this.usuario.papel) {
            case EnumPapel.Admin:
                return this.LinksAdmin();

            case EnumPapel.Aluno:
                return this.LinksAluno(this.usuario.id);

            case EnumPapel.Professor:
                return this.LinksProfessor(this.usuario.id);

            default:
                return this.LinksPadrao();
        }
    }

    private LinksPadrao() {
        return [
            { label: 'Biblioteca', href: '/biblioteca' },
        ];
    }

    private LinksAluno(idUsuario: number) {
        return [
            { label: 'Biblioteca', href: '/biblioteca' },
            { label: 'Seus Projetos', href: `/usuario/${idUsuario}/projetos` },
            // { label: 'Atividades', href: '/atividades' },
        ];
    }

    private LinksAdmin() {
        return [
            { label: 'Biblioteca', href: '/biblioteca' },
            { label: 'Cursos', href: '/cursos' },
            { label: 'Usuários', href: '/usuarios' },
            { label: 'Projetos', href: '/projetos' },
            { label: 'Documento', href: '/documento' },
        ];
    }

    private LinksProfessor(idUsuario: number) {
        return [
            { label: 'Biblioteca', href: '/biblioteca' },
            { label: 'Seus Projetos', href: `/usuario/${idUsuario}/projetos` },
            { label: 'Atividades', href: '/atividades' },
            { label: 'Banca', href: '/banca' }
        ];
    }
}
