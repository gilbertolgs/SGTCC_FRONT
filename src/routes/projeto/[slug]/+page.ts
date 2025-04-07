import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _alterUserSchema = z.object({
    nome: z.string().min(3, "Insira um nome"),
    email: z.string().email("Insira um Email válido"),
});

export const load = async ({ params, fetch }) => {
    const form = await superValidate(zod(_alterUserSchema));

    const idProjeto = parseInt(params.slug);

    return { form, idProjeto };
};