<script lang="ts">
	import type { LayoutData } from './$types';

	let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

<div class="admin-layout">
	<aside class="sidebar">
		<div class="sidebar-header">
			<a href="/admin" class="logo">MangaAja Admin</a>
		</div>
		<nav class="sidebar-nav">
			<a href="/admin" class="nav-item">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="3" y="3" width="7" height="9"/>
					<rect x="14" y="3" width="7" height="5"/>
					<rect x="14" y="12" width="7" height="9"/>
					<rect x="3" y="16" width="7" height="5"/>
				</svg>
				Dashboard
			</a>
			<a href="/admin/manga" class="nav-item">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
					<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
				</svg>
				Manga
			</a>
		</nav>
		<div class="sidebar-footer">
			<a href="/" class="nav-item">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				Back to Site
			</a>
		</div>
	</aside>
	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
		background: #0a0a0a;
	}

	.sidebar {
		width: 250px;
		background: #111;
		border-right: 1px solid #222;
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid #222;
	}

	.logo {
		font-size: 1.25rem;
		font-weight: 700;
		color: #fff;
		text-decoration: none;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		color: #888;
		text-decoration: none;
		border-radius: 0.5rem;
		transition: all 0.2s;
	}

	.nav-item:hover {
		background: #1a1a1a;
		color: #fff;
	}

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid #222;
	}

	.main-content {
		flex: 1;
		margin-left: 250px;
		padding: 2rem;
		min-height: 100vh;
	}
</style>
