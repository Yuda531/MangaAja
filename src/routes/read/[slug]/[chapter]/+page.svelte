<script lang="ts">
	import Reader from '$lib/components/reader/Reader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Chapter {data.chapter.chapterNumber} - {data.manga.title} | MangaAja</title>
	<meta name="description" content="Read {data.manga.title} Chapter {data.chapter.chapterNumber} online" />
</svelte:head>

<Reader 
	chapter={data.chapter}
	manga={data.manga}
	prevChapter={data.prevChapter}
	nextChapter={data.nextChapter}
	isLoggedIn={data.isLoggedIn}
/>
