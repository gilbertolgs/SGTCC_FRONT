import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

export const _userSchema = z.object({
    email: z.string().email("Insira um Email válido"),
    senha: z.string().min(2, "Senha Curta!")
});

export const load = async ({ params, fetch }) => {
    const form = await superValidate(zod(_userSchema));

    return { form };
};