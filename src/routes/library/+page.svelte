<script lang="ts">
	import MangaGrid from '$lib/components/manga/MangaGrid.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Library | MangaAja</title>
</svelte:head>

<div class="page">
	<header class="header">
		<div class="container">
			<a href="/" class="back-link">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M19 12H5M12 19l-7-7 7-7"/>
				</svg>
				<span>Home</span>
			</a>
			<h1 class="page-title">Library</h1>
		</div>
	</header>

	<main class="main">
		<div class="container">
			<!-- User Info -->
			<div class="user-info">
				<div class="avatar">
					{data.user.username.charAt(0).toUpperCase()}
				</div>
				<div class="user-details">
					<p class="username">{data.user.username}</p>
					<p class="email">{data.user.email}</p>
				</div>
				<form method="POST" action="/auth/logout">
					<button type="submit" class="logout-btn">Logout</button>
				</form>
			</div>

			<!-- Tabs -->
			<nav class="tabs">
				<a href="/library" class="tab active">Bookmarks</a>
				<a href="/history" class="tab">History</a>
			</nav>

			<!-- Bookmarks -->
			<section class="section">
				{#if data.bookmarks.length === 0}
					<div class="empty-state">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
						</svg>
						<p>No bookmarks yet</p>
						<a href="/browse" class="browse-link">Browse manga</a>
					</div>
				{:else}
					<MangaGrid manga={data.bookmarks} />
				{/if}
			</section>
		</div>
	</main>
</div>

<style>
	.page {
		min-height: 100vh;
		background-color: var(--color-bg);
	}

	.header {
		padding: var(--spacing-md) 0;
		padding-top: calc(var(--spacing-md) + var(--safe-area-top));
		border-bottom: 1px solid var(--color-border);
	}

	.header .container {
		display: flex;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-sm);
		color: var(--color-text-secondary);
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.back-link:hover {
		color: var(--color-text);
	}

	.page-title {
		font-size: 1.25rem;
		font-weight: 600;
	}

	.main {
		padding: var(--spacing-xl) 0;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
		margin-bottom: var(--spacing-xl);
	}

	.avatar {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		font-size: 1.25rem;
		border-radius: 50%;
	}

	.user-details {
		flex: 1;
	}

	.username {
		font-weight: 600;
	}

	.email {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}

	.logout-btn {
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		color: var(--color-text);
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: var(--radius-md);
		transition: all var(--transition-fast);
	}

	.logout-btn:hover {
		background-color: var(--color-error);
	}

	.tabs {
		display: flex;
		gap: var(--spacing-sm);
		margin-bottom: var(--spacing-xl);
	}

	.tab {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-bg-secondary);
		color: var(--color-text-secondary);
		font-weight: 500;
		border-radius: var(--radius-lg);
		transition: all var(--transition-fast);
	}

	.tab:hover {
		background-color: var(--color-bg-tertiary);
	}

	.tab.active {
		background-color: var(--color-primary);
		color: white;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-2xl);
		color: var(--color-text-muted);
	}

	.browse-link {
		padding: var(--spacing-sm) var(--spacing-lg);
		background-color: var(--color-primary);
		color: white;
		font-weight: 500;
		border-radius: var(--radius-md);
	}
</style>
