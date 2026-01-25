<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props<{ data: PageData }>();

	let chapterNumber = $state(data.chapter.chapterNumber);
	let title = $state(data.chapter.title || '');
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		submitting = true;
		error = null;

		try {
			const response = await fetch(`/api/admin/chapters/${data.chapter.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					chapterNumber,
					title: title.trim() || null,
					slug: `chapter-${chapterNumber}`
				})
			});

			if (response.ok) {
				goto(`/admin/manga/${data.manga.slug}/chapters`);
			} else {
				const err = await response.json();
				error = err.message || 'Failed to update chapter';
			}
		} catch (e) {
			error = 'An error occurred';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit Chapter {data.chapter.chapterNumber} - {data.manga.title} - Admin</title>
</svelte:head>

<div class="edit-chapter">
	<div class="header">
		<a href="/admin/manga/{data.manga.slug}/chapters" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</a>
		<div>
			<h1>Edit Chapter {data.chapter.chapterNumber}</h1>
			<p class="manga-title">{data.manga.title}</p>
		</div>
	</div>

	{#if error}
		<div class="error-message">{error}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-row">
			<div class="form-group">
				<label for="chapterNumber">Chapter Number</label>
				<input
					type="number"
					id="chapterNumber"
					bind:value={chapterNumber}
					min="1"
					required
				/>
			</div>
			<div class="form-group flex-1">
				<label for="title">Title (optional)</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					placeholder="e.g. The Beginning"
				/>
			</div>
		</div>

		<div class="form-group">
			<label>Current Pages ({data.chapter.pages.length})</label>
			<div class="pages-grid">
				{#each data.chapter.pages as page}
					<div class="page-item">
						<span class="page-number">{page.pageNumber}</span>
						<img src={page.imageUrl} alt="Page {page.pageNumber}" />
					</div>
				{/each}
			</div>
		</div>

		<div class="form-actions">
			<a href="/admin/manga/{data.manga.slug}/chapters" class="btn-secondary">Cancel</a>
			<button type="submit" class="btn-primary" disabled={submitting}>
				{#if submitting}
					Saving...
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.edit-chapter {
		max-width: 1000px;
	}

	.header {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.back-link {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1a1a1a;
		border-radius: 0.5rem;
		color: #888;
		text-decoration: none;
		transition: all 0.2s;
	}

	.back-link:hover {
		background: #222;
		color: #fff;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.25rem;
	}

	.manga-title {
		color: #666;
		font-size: 0.875rem;
	}

	.error-message {
		background: #dc262620;
		border: 1px solid #dc2626;
		color: #ef4444;
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	form {
		background: #111;
		border: 1px solid #222;
		border-radius: 0.75rem;
		padding: 2rem;
	}

	.form-row {
		display: flex;
		gap: 1rem;
	}

	.flex-1 {
		flex: 1;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		font-weight: 500;
		color: #fff;
		margin-bottom: 0.5rem;
	}

	input[type="text"],
	input[type="number"] {
		width: 100%;
		padding: 0.75rem 1rem;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 0.5rem;
		color: #fff;
		font-size: 1rem;
	}

	input[type="text"]:focus,
	input[type="number"]:focus {
		outline: none;
		border-color: #6366f1;
	}

	input[type="number"] {
		width: 120px;
	}

	.pages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
	}

	.page-item {
		position: relative;
		aspect-ratio: 3/4;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 0.375rem;
		overflow: hidden;
	}

	.page-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.page-number {
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		background: #000;
		color: #fff;
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #222;
	}

	.btn-primary {
		padding: 0.75rem 1.5rem;
		background: #6366f1;
		color: #fff;
		border: none;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-primary:hover:not(:disabled) {
		background: #4f46e5;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		padding: 0.75rem 1.5rem;
		background: #1a1a1a;
		color: #fff;
		border: 1px solid #333;
		border-radius: 0.5rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: #222;
	}
</style>
