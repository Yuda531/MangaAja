<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	let { data } = $props<{ data: PageData }>();
	let deleting = $state<string | null>(null);

	async function handleDelete(id: string, chapterNumber: number) {
		if (!confirm(`Are you sure you want to delete Chapter ${chapterNumber}? This action cannot be undone.`)) {
			return;
		}

		deleting = id;
		try {
			const response = await fetch(`/api/admin/chapters/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const error = await response.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			alert('Failed to delete chapter');
		} finally {
			deleting = null;
		}
	}
</script>

<svelte:head>
	<title>Chapters - {data.manga.title} - Admin</title>
</svelte:head>

<div class="chapters">
	<div class="header">
		<div class="header-left">
			<a href="/admin/manga" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
			</a>
			<div>
				<h1>Chapters</h1>
				<p class="manga-title">{data.manga.title}</p>
			</div>
		</div>
		<a href="/admin/manga/{data.manga.slug}/chapters/new" class="btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"/>
				<line x1="12" y1="8" x2="12" y2="16"/>
				<line x1="8" y1="12" x2="16" y2="12"/>
			</svg>
			Add Chapter
		</a>
	</div>

	{#if data.chapters.length === 0}
		<div class="empty">
			<p>No chapters yet. Add your first chapter!</p>
			<a href="/admin/manga/{data.manga.slug}/chapters/new" class="btn-primary">Add Chapter</a>
		</div>
	{:else}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Chapter</th>
						<th>Title</th>
						<th>Created</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.chapters as chapter}
						<tr>
							<td class="chapter-num">
								Chapter {chapter.chapterNumber}
							</td>
							<td class="title-cell">
								{chapter.title || '-'}
							</td>
							<td class="date-cell">
								{new Date(chapter.createdAt).toLocaleDateString()}
							</td>
							<td class="actions-cell">
								<a href="/read/{data.manga.slug}/{chapter.chapterNumber}" class="btn-icon" title="View" target="_blank">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
										<circle cx="12" cy="12" r="3"/>
									</svg>
								</a>
								<a href="/admin/manga/{data.manga.slug}/chapters/{chapter.chapterNumber}" class="btn-icon" title="Edit">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
									</svg>
								</a>
								<button
									class="btn-icon btn-danger"
									title="Delete"
									onclick={() => handleDelete(chapter.id, chapter.chapterNumber)}
									disabled={deleting === chapter.id}
								>
									{#if deleting === chapter.id}
										<svg class="spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M21 12a9 9 0 1 1-6.219-8.56"/>
										</svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="3 6 5 6 21 6"/>
											<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
										</svg>
									{/if}
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.chapters {
		max-width: 1000px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.header-left {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
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

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: #6366f1;
		color: #fff;
		border-radius: 0.5rem;
		text-decoration: none;
		font-weight: 500;
		transition: background 0.2s;
	}

	.btn-primary:hover {
		background: #4f46e5;
	}

	.empty {
		text-align: center;
		padding: 4rem 2rem;
		background: #111;
		border: 1px solid #222;
		border-radius: 0.75rem;
		color: #666;
	}

	.empty p {
		margin-bottom: 1rem;
	}

	.table-container {
		background: #111;
		border: 1px solid #222;
		border-radius: 0.75rem;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th, td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #222;
	}

	th {
		background: #0a0a0a;
		font-weight: 600;
		color: #888;
		font-size: 0.875rem;
		text-transform: uppercase;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: #1a1a1a;
	}

	.chapter-num {
		font-weight: 600;
		color: #fff;
	}

	.title-cell {
		color: #888;
	}

	.date-cell {
		color: #666;
		font-size: 0.875rem;
	}

	.actions-cell {
		display: flex;
		gap: 0.5rem;
	}

	.btn-icon {
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 0.375rem;
		color: #888;
		cursor: pointer;
		transition: all 0.2s;
		text-decoration: none;
	}

	.btn-icon:hover {
		background: #222;
		color: #fff;
	}

	.btn-danger:hover {
		background: #dc2626;
		border-color: #dc2626;
		color: #fff;
	}

	.btn-icon:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
