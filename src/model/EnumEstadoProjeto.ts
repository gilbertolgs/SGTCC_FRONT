export enum EnumEstadoProjeto {
    Criado = 0,
    EmProgresso = 1,
    Cancelado = 2,
    Finalizado = 3
}

export const textoEnumEstadoProjeto: Record<EnumEstadoProjeto, string> = {
    [EnumEstadoProjeto.Criado]: "Criado",
    [EnumEstadoProjeto.EmProgresso]: "Em Progresso",
    [EnumEstadoProjeto.Cancelado]: "Cancelado",
    [EnumEstadoProjeto.Finalizado]: "Finalizado",
};

export const EnumEstadoProjetoTodosPapeis = Object.entries(textoEnumEstadoProjeto).map(([key, label]) => ({
    valor: Number(key),
    label
}));