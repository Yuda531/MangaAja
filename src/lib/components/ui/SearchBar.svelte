<script lang="ts">
	import { goto } from '$app/navigation';

	let query = $state('');
	let showResults = $state(false);
	let results = $state<{ id: string; title: string; slug: string; coverUrl: string | null }[]>([]);
	let loading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	async function handleInput() {
		clearTimeout(debounceTimer);

		if (query.length < 2) {
			results = [];
			showResults = false;
			return;
		}

		debounceTimer = setTimeout(async () => {
			loading = true;
			try {
				const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
				const data = await response.json();
				results = data.data || [];
				showResults = true;
			} catch {
				results = [];
			} finally {
				loading = false;
			}
		}, 300);
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (query.trim()) {
			goto(`/search?q=${encodeURIComponent(query.trim())}`);
			showResults = false;
		}
	}

	function handleBlur() {
		// Delay to allow clicking on results
		setTimeout(() => {
			showResults = false;
		}, 200);
	}

	function selectResult(slug: string) {
		goto(`/manga/${slug}`);
		showResults = false;
		query = '';
	}
</script>

<div class="search-container">
	<form class="search-form" onsubmit={handleSubmit}>
		<div class="search-input-wrapper">
			<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8"/>
				<path d="M21 21l-4.35-4.35"/>
			</svg>
			<input
				type="search"
				bind:value={query}
				oninput={handleInput}
				onfocus={() => query.length >= 2 && (showResults = true)}
				onblur={handleBlur}
				placeholder="Search manga..."
				class="search-input"
				autocomplete="off"
			/>
			{#if loading}
				<div class="search-spinner"></div>
			{/if}
		</div>
	</form>

	{#if showResults && results.length > 0}
		<div class="search-results">
			{#each results as result (result.id)}
				<button class="search-result" onclick={() => selectResult(result.slug)}>
					{#if result.coverUrl}
						<img src={result.coverUrl} alt="" class="result-cover" />
					{:else}
						<div class="result-cover-placeholder"></div>
					{/if}
					<span class="result-title">{result.title}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.search-container {
		position: relative;
		width: 100%;
		max-width: 300px;
	}

	.search-form {
		width: 100%;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-icon {
		position: absolute;
		left: var(--spacing-md);
		color: var(--color-text-muted);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		padding-left: calc(var(--spacing-md) * 2 + 18px);
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		color: var(--color-text);
		outline: none;
		transition: all var(--transition-fast);
	}

	.search-input::placeholder {
		color: var(--color-text-muted);
	}

	.search-input:focus {
		border-color: var(--color-primary);
		background-color: var(--color-bg-tertiary);
	}

	.search-spinner {
		position: absolute;
		right: var(--spacing-md);
		width: 16px;
		height: 16px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.search-results {
		position: absolute;
		top: calc(100% + var(--spacing-sm));
		left: 0;
		right: 0;
		background-color: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		max-height: 300px;
		overflow-y: auto;
		z-index: var(--z-dropdown);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	}

	.search-result {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		text-align: left;
		transition: background-color var(--transition-fast);
	}

	.search-result:hover {
		background-color: var(--color-bg-tertiary);
	}

	.result-cover {
		width: 40px;
		height: 56px;
		object-fit: cover;
		border-radius: var(--radius-sm);
	}

	.result-cover-placeholder {
		width: 40px;
		height: 56px;
		background-color: var(--color-bg-tertiary);
		border-radius: var(--radius-sm);
	}

	.result-title {
		flex: 1;
		font-size: 0.875rem;
		color: var(--color-text);
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
