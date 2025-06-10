export enum EnumPapel {
    Aluno = 1,
    Professor = 2,
    Admin = 3,
    Coordenador = 4,
    ProfessorResponsavel = 5
}

export const textoEnumPapel: Record<EnumPapel, string> = {
    [EnumPapel.Aluno]: "Aluno",
    [EnumPapel.Professor]: "Professor",
    [EnumPapel.Admin]: "Secretaria",
    [EnumPapel.Coordenador]: "Coordenador",
    [EnumPapel.ProfessorResponsavel]: "Professor Responsável",
};

export const EnumPapelTodosPapeis = Object.entries(textoEnumPapel).map(([key, label]) => ({
    valor: Number(key),
    label
}));