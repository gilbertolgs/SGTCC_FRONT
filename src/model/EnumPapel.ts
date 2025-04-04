export enum EnumPapel {
    Aluno = 1,
    Professor = 2,
    Admin = 3
}

export const textoEnumPapel: Record<EnumPapel, string> = {
    [EnumPapel.Aluno]: "Aluno",
    [EnumPapel.Professor]: "Professor",
    [EnumPapel.Admin]: "Administrador",
};

export const EnumPapelTodosPapeis = Object.entries(textoEnumPapel).map(([key, label]) => ({
    valor: Number(key),
    label
}));