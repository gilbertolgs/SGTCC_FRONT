<script lang="ts">
  import imgSrc from "$icons/projetoimagem.png";
  interface Props {
    item: {
    nome: String;
    descricao: String;
    id: Number;
  };
    tipo: string;
  }

  let { item, tipo }: Props = $props();
</script>

<div
  class="variant-ghost-surface rounded-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all m-4 border border-surface-500"
>
  <div class="h-40">
    <img
      src={imgSrc}
      alt="Imagem de {item.nome}"
      class="h-40 w-full object-cover object-center"
    />
  </div>

  <div class="p-1">
    <div class="w-full flex">
      <span
        class="text-xs font-semibold p-1 uppercase rounded-full text-primary-600 bg-primary-200"
      >
        Progresso
      </span>
      <span class="ml-auto my-auto text-xs font-bold p-1 uppercase rounded-full text-primary-600 bg-primary-200"> 50% </span>
    </div>
    <div class="mt-2 h-3 bg-surface-500 dark:bg-surface-200 rounded">
      <div class="bg-primary-500 h-full rounded" style="width: 50%;"></div>
    </div>
  </div>
  
  <div class="p-4">
    <h3 class="mb-2 text-base font-semibold text-content-primary">
      <a
        href="/{tipo}/{item.id}"
        class="hover:underline hover:text-primary-500"
      >
        {item.nome}
      </a>
    </h3>
    <div class="flex flex-row justify-between text-xs mt-2 text-text-secondary">
      <p class="truncate">{item.descricao}</p>
    </div>
  </div>
</div>

<style>
</style>
