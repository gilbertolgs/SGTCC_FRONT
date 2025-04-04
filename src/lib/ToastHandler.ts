import { type ToastContext } from '@skeletonlabs/skeleton-svelte';
export default class Toaster {
    private getContext: Function
    public toast: ToastContext

    constructor(getContext: Function,) {
        this.getContext = getContext;
        this.toast = this.getContext('toast');
    }

    public triggerSuccess(descricao: string) {
        this.create(
            'Sucesso!',
            descricao,
            'success'
        );
    }

    public triggerWarn(descricao: string) {
        this.create(
            'Atenção!',
            descricao,
            'info'
        );
    }

    public triggerError(descricao: string) {
        this.create(
            'Erro!',
            descricao,
            'error'
        );
    }

    private create(title: string, description: string, type: any) {
        this.toast.create({
            title: title,
            description: description,
            type: type
        });
    }
}
