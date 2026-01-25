<script lang="ts">
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Admin Dashboard - MangaAja</title>
</svelte:head>

<div class="dashboard">
	<h1>Dashboard</h1>

	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
				</svg>
			</div>
			<div class="stat-content">
				<div class="stat-value">{data.stats.totalManga}</div>
				<div class="stat-label">Total Manga</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
					<polyline points="14 2 14 8 20 8"/>
					<line x1="16" y1="13" x2="8" y2="13"/>
					<line x1="16" y1="17" x2="8" y2="17"/>
				</svg>
			</div>
			<div class="stat-content">
				<div class="stat-value">{data.stats.totalChapters}</div>
				<div class="stat-label">Total Chapters</div>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
					<circle cx="9" cy="7" r="4"/>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
					<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
				</svg>
			</div>
			<div class="stat-content">
				<div class="stat-value">{data.stats.totalUsers}</div>
				<div class="stat-label">Total Users</div>
			</div>
		</div>
	</div>

	<div class="quick-actions">
		<h2>Quick Actions</h2>
		<div class="actions-grid">
			<a href="/admin/manga/new" class="action-card">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="10"/>
					<line x1="12" y1="8" x2="12" y2="16"/>
					<line x1="8" y1="12" x2="16" y2="12"/>
				</svg>
				Add New Manga
			</a>
			<a href="/admin/manga" class="action-card">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
				</svg>
				Manage Manga
			</a>
		</div>
	</div>
</div>

<style>
	.dashboard {
		max-width: 1200px;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 2rem;
	}

	h2 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background: #111;
		border: 1px solid #222;
		border-radius: 0.75rem;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stat-icon {
		width: 48px;
		height: 48px;
		background: #1a1a1a;
		border-radius: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6366f1;
	}

	.stat-value {
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
	}

	.stat-label {
		font-size: 0.875rem;
		color: #666;
	}

	.quick-actions {
		background: #111;
		border: 1px solid #222;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.action-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: #1a1a1a;
		border-radius: 0.5rem;
		color: #fff;
		text-decoration: none;
		transition: all 0.2s;
	}

	.action-card:hover {
		background: #222;
	}

	.action-card svg {
		color: #6366f1;
	}
</style>
