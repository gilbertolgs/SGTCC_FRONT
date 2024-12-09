import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";

class alert {
	toastStore: any
	constructor(toastStore: any) {
		this.toastStore = toastStore;
	}
public display(mensagem: string, fundo: string) {
  const t: ToastSettings = {
    message: mensagem,
    background: fundo,
  };

  this.toastStore.trigger(t);
}
}


export default alert;
