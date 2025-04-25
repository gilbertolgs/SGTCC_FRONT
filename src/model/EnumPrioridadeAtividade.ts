export enum EnumPrioridadeAtividade {
    Baixa = 0,
    Media = 1,
    Alta = 2,
}

export const textoEnumPrioridadeAtividade: Record<EnumPrioridadeAtividade, string> = {
    [EnumPrioridadeAtividade.Baixa]: "Baixa",
    [EnumPrioridadeAtividade.Media]: "Média",
    [EnumPrioridadeAtividade.Alta]: "Alta",
};

export const EnumPrioridadeAtividadeTodos = Object.entries(textoEnumPrioridadeAtividade).map(([key, label]) => ({
    valor: Number(key),
    label
}));