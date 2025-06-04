export enum EnumTipoNota {
    QuantoAoProjeto = 1,
    QuantoAoTexto = 2,
    QuantoApresentacao = 3
}

export const textoEnumTipoNota: Record<EnumTipoNota, string> = {
    [EnumTipoNota.QuantoAoProjeto]: "Quanto ao Projeto",
    [EnumTipoNota.QuantoAoTexto]: "Quanto ao Texto",
    [EnumTipoNota.QuantoApresentacao]: "Quanto Apresentação",
};

export const EnumTipoNotaTodosPapeis = Object.entries(textoEnumTipoNota).map(([key, label]) => ({
    valor: Number(key),
    label
}));