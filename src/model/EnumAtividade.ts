export enum EnumAtividade {
    Created = 0,
    InProgress = 1,
    Finished = 2
}

export const textoEnumAtividade: Record<EnumAtividade, string> = {
    [EnumAtividade.Created]: "Criado",
    [EnumAtividade.InProgress]: "Em Progresso",
    [EnumAtividade.Finished]: "Finalizado",
};

export const EnumAtividadeTodosPapeis = Object.entries(textoEnumAtividade).map(([key, label]) => ({
    valor: Number(key),
    label
}));