export enum EnumConvite {
    Pendente = 0,
    Expirado = 1,
    Aceito = 2,
    Rejeitado = 3,
}

export const textoEnumConvite: Record<EnumConvite, string> = {
    [EnumConvite.Pendente]: "Pendente",
    [EnumConvite.Expirado]: "Expirado",
    [EnumConvite.Aceito]: "Aceito",
    [EnumConvite.Rejeitado]: "Rejeitado",
};

export const EnumConviteTodosPapeis = Object.entries(textoEnumConvite).map(([key, label]) => ({
    valor: Number(key),
    label
}));