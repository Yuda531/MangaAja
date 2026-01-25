<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Error {$page.status} | MangaAja</title>
</svelte:head>

<div class="error-page">
	<div class="error-container">
		<h1 class="error-code">{$page.status}</h1>
		<p class="error-message">
			{#if $page.status === 404}
				Page not found
			{:else if $page.status === 500}
				Something went wrong
			{:else}
				{$page.error?.message || 'An error occurred'}
			{/if}
		</p>
		<a href="/" class="home-link">Back to Home</a>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		background-color: var(--color-bg);
	}

	.error-container {
		text-align: center;
	}

	.error-code {
		font-size: 6rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1;
		margin-bottom: var(--spacing-md);
	}

	.error-message {
		font-size: 1.25rem;
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-xl);
	}

	.home-link {
		display: inline-block;
		padding: var(--spacing-md) var(--spacing-xl);
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		border-radius: var(--radius-lg);
		transition: background-color var(--transition-fast);
	}

	.home-link:hover {
		background-color: var(--color-primary-hover);
	}
</style>
