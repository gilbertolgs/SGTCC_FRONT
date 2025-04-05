import { error } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _registerCourseSchema = z.object({
    id: z.number(),
    nome: z.string().min(3, "Insira um nome para o curso"),
    descricao: z.string().min(20, "Descrição deve ter mais de 20 caracteres"),
});

export const load = async ({ params, fetch }) => {
    const form = await superValidate(zod(_registerCourseSchema));

    return { form };
};