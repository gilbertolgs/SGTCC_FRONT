<script lang="ts">
  import imgSrc from "$icons/projetoimagem.png";
  import imgPerfil from "$lib/images/imgPerfil";

  import type Projeto from "$icons/projeto.svelte";
  import Usuario from "$model/Usuario";
  import IconStar from "$icons/star.svelte";

  let { projeto, cursosMap } = $props();
</script>

<div
  class="variant-ghost-surface rounded-lg overflow-hidden hover:shadow-2xl transition-all m-4 border border-surface-500"
>
  <div class="h-40">
    <img
      src={imgSrc}
      alt="Imagem de {projeto.nome}"
      class="h-40 w-full object-cover object-center"
    />
  </div>

  <div class="grid grid-flow-col">
    <div>
      <div class="p-4">
        <h3 class="mb-1 text-base font-semibold text-content-primary">
          <a
            href="/projeto/{projeto.id}"
            class="hover:underline hover:text-primary-500"
          >
            {projeto.nome}
          </a>
        </h3>

        <div class="flex flex-row justify-between text-xs text-text-secondary">
          <p class="truncate">{projeto.descricao}</p>
        </div>
      </div>

      {#if projeto.tags.length > 0}
        <div class="p-2 flex gap-1">
          {#each projeto.tags as tag}
            <span class="chip btn variant-filled-primary">{tag.nome}</span>
          {/each}
        </div>
      {/if}

      {#if projeto.usuarios.length > 0}
        <div class="flex p-2 pt-0 gap-1">
          <div class="font-bold">
            {cursosMap[projeto.usuarios[0].idCurso]}
          </div>
          <span>·</span>
          <div class="flex">
            <span><IconStar /></span>
            0
          </div>
          <span>·</span>
          <div>
            {projeto.dataFim.replace(/-/g, "/")}
          </div>
        </div>
      {/if}
    </div>
    <div class="grid ml-auto p-4">
      {#each projeto.usuarios as usuario}
        <a href="/usuario/{usuario.idUsuario}" class="anchor">
          <div class="flex gap-1">
            <div class="w-5">
              <img src={imgPerfil} alt="" class="rounded" />
            </div>

            {usuario.nome}
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>
