import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { number, z } from 'zod';

export const _alterProjectSchema = z.object({
    id: number(),
    nome: z.string().min(3, "Insira um nome"),
    descricao: z.string().min(5, "Insira uma descrição").max(300, "Descrição muito longa"),
    justificativa: z.string().min(5, "Insira uma Justificativa").max(300, "Justificativa muito longa"),
    tags: z.string().min(2, "Insira Tag").array().min(1, "Insira no mínimo uma Tag")
});

export const _addActivitySchema = z.object({
    id: number(),
    nome: z.string().min(3, "Insira um nome"),
    descricao: z.string().max(300, "Descrição muito longa").nullish(),
    idUsuario: z.number().min(1, "Selecione um usuario"),
    usuarioEncarregado: z.string(),
    duracaoEstimada: z.number().min(1, "Atividade deve ter no mínimo 1 hora"),
    prioridade: z.number(),
    dataInicio: z.string({ invalid_type_error: "Insira uma data de início" }).date().min(4, "Insira uma data de início"),
    dataFim: z.string().nullish()
});

export const _addProposalSchema = z.object({
    id: number(),
    idProjeto: number(),
    atividadesPropostas: z.string(),
    contribuicaoAgenda: z.string(),
    sugestao: z.string(),
});

export const _addRelatorioSchema = z.object({
    id: z.number(),
    titulo: z.string().min(1, 'Título é obrigatório'),
    descricao: z.string().min(1, 'Descrição é obrigatória'),
    duracaoEncontro: z.number().min(1, 'Duração deve ser maior que zero'),
    dataRealizacao: z.string().min(1, 'Data de realização é obrigatória'), // Pode ser ajustado para z.date() se necessário
});

export const _addNoteSchema = z.object({
    id: number(),
    titulo: z.string(),
    descricao: z.string().max(500, "Descrição muito longa").nullish(),
});

export const _addBibliographySchema = z.object({
    id: number(),
    autores: z.string().min(2, "Insira nomes de autores").max(255, "autores muito longo"),
    referencia: z.string().min(2, "Insira a referência").max(400, "referência muito longa"),
    acessadoEm: z.string().date().min(4, "Insira uma Data de Acesso"),
});

export const _addDuvidaSchema = z.object({
    id: number(),
    texto: z.string().min(2, "Insira um Texto para a dúvida").max(500, "Pergunta muito longa"),
    visibilidade: z.number(),
});

export const load = async ({ params, fetch }) => {
    const alterProjectForm = await superValidate(zod(_alterProjectSchema));
    const activityForm = await superValidate(zod(_addActivitySchema));
    const proposalForm = await superValidate(zod(_addProposalSchema));
    const noteForm = await superValidate(zod(_addNoteSchema));
    const bibliographyForm = await superValidate(zod(_addBibliographySchema));
    const duvidaForm = await superValidate(zod(_addDuvidaSchema));
    const relatorioForm = await superValidate(zod(_addRelatorioSchema));

    const idProjeto = parseInt(params.slug);

    return { alterProjectForm, activityForm, proposalForm, noteForm, bibliographyForm, duvidaForm, relatorioForm, idProjeto };
};