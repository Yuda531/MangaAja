<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
	let deleting = $state<string | null>(null);

	async function handleDelete(id: string, title: string) {
		if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
			return;
		}

		deleting = id;
		try {
			const response = await fetch(`/api/admin/manga/${id}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				window.location.reload();
			} else {
				const error = await response.json();
				alert(`Error: ${error.message}`);
			}
		} catch (error) {
			alert('Failed to delete manga');
		} finally {
			deleting = null;
		}
	}
</script>

<svelte:head>
	<title>Manage Manga - Admin</title>
</svelte:head>

<div class="manga-list">
	<div class="header">
		<h1>Manga</h1>
		<a href="/admin/manga/new" class="btn-primary">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="12" cy="12" r="10"/>
				<line x1="12" y1="8" x2="12" y2="16"/>
				<line x1="8" y1="12" x2="16" y2="12"/>
			</svg>
			Add Manga
		</a>
	</div>

	{#if data.manga.length === 0}
		<div class="empty">
			<p>No manga found. Create your first manga!</p>
			<a href="/admin/manga/new" class="btn-primary">Add Manga</a>
		</div>
	{:else}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Cover</th>
						<th>Title</th>
						<th>Status</th>
						<th>Genres</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.manga as m}
						<tr>
							<td class="cover-cell">
								{#if m.coverUrl}
									<img src={m.coverUrl} alt={m.title} class="cover-thumb" />
								{:else}
									<div class="cover-placeholder"></div>
								{/if}
							</td>
							<td class="title-cell">
								<a href="/manga/{m.slug}" target="_blank">{m.title}</a>
							</td>
							<td>
								<span class="status-badge status-{m.status}">{m.status}</span>
							</td>
							<td class="genres-cell">
								{m.genres.map((g: { name: string }) => g.name).join(', ') || '-'}
							</td>
							<td class="actions-cell">
								<a href="/admin/manga/{m.slug}/chapters" class="btn-icon" title="Manage Chapters">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
										<polyline points="14 2 14 8 20 8"/>
									</svg>
								</a>
								<a href="/admin/manga/{m.slug}/edit" class="btn-icon" title="Edit">
									<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
										<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
									</svg>
								</a>
								<button
									class="btn-icon btn-danger"
									title="Delete"
									onclick={() => handleDelete(m.id, m.title)}
									disabled={deleting === m.id}
								>
									{#if deleting === m.id}
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
	.manga-list {
		max-width: 1200px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
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

	.cover-cell {
		width: 60px;
	}

	.cover-thumb {
		width: 40px;
		height: 56px;
		object-fit: cover;
		border-radius: 0.25rem;
	}

	.cover-placeholder {
		width: 40px;
		height: 56px;
		background: #222;
		border-radius: 0.25rem;
	}

	.title-cell a {
		color: #fff;
		text-decoration: none;
	}

	.title-cell a:hover {
		color: #6366f1;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-ongoing {
		background: #059669;
		color: #fff;
	}

	.status-completed {
		background: #6366f1;
		color: #fff;
	}

	.status-hiatus {
		background: #f59e0b;
		color: #000;
	}

	.genres-cell {
		color: #888;
		font-size: 0.875rem;
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
