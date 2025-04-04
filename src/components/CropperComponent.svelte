<script lang="ts">
	import { getCroppedImg } from '$lib/canvasUtils';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import IconRemove from 'lucide-svelte/icons/circle-x';
	import IconDropzone from 'lucide-svelte/icons/image-plus';
	import IconFile from 'lucide-svelte/icons/paperclip';
	import Cropper, { type OnCropCompleteEvent } from 'svelte-easy-crop';

	let { objeto, salvaImagem, cropShape, aspect } = $props();

	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let image: string | null = $state(null);
	let imageName: string | null = $state(null);

	let croppedImage: OnCropCompleteEvent | null;

	function atualizaImagem(event: OnCropCompleteEvent) {
		croppedImage = event;
	}

	async function montaImagem() {
		if (!image || !croppedImage || !imageName) {
			return;
		}
		const resultImage = await getCroppedImg(image, croppedImage.pixels);

		if (!resultImage) {
			return;
		}

		salvaImagem(objeto.id, imageName, resultImage);
	}

	function cancelarImagem() {
		image = null;
		imageName = null;
	}

	function onFileSelected(e: { acceptedFiles: any[]; rejectedFiles: any[] }) {
		let imageFile = e.acceptedFiles[0];
		imageName = imageFile.name;

		let reader = new FileReader();
		reader.onload = (e) => {
			if (e.target) {
				image = e.target.result?.toString() ?? null;
			}
		};
		reader.readAsDataURL(imageFile);
	}
</script>

<div class="h-[75%] md:h-auto">
	<div class="relative h-full md:h-[30rem]">
		{#if image}
			<Cropper
				{cropShape}
				{aspect}
				zoomSpeed={0.1}
				{image}
				bind:crop
				bind:zoom
				oncropcomplete={(e) => atualizaImagem(e)}
			/>
		{:else}
			<FileUpload
				name="example"
				accept="image/*"
				maxFiles={1}
				label="Insira Imagem Aqui"
				onFileChange={onFileSelected}
				onFileReject={console.error}
				classes="w-full"
			>
				{#snippet iconInterface()}<IconDropzone class="size-8" />{/snippet}
				{#snippet iconFile()}<IconFile class="size-4" />{/snippet}
				{#snippet iconFileRemove()}<IconRemove class="size-4" />{/snippet}
			</FileUpload>
		{/if}
	</div>
	<div class="relative">
		{#if image}
			<button class="btn preset-filled-primary-500 m-2" onclick={montaImagem}>Envia</button>
			<button class="btn preset-filled-error-500 m-2" onclick={cancelarImagem}>Cancelar</button>
		{/if}
	</div>
</div>
