<script lang="ts">
	import '../app.css';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let userMenuOpen = $state(false);

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function closeUserMenu() {
		userMenuOpen = false;
	}

	async function handleLogout() {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/auth/logout';
		document.body.appendChild(form);
		form.submit();
	}
</script>

<svelte:window onclick={() => userMenuOpen = false} />

<div class="app">
	<header class="header">
		<div class="container">
			<div class="header-content">
				<a href="/" class="logo">
					<span class="logo-text">MangaAja</span>
				</a>

				<nav class="nav">
					<a href="/browse" class="nav-link">Browse</a>
					{#if data.user}
						<a href="/library" class="nav-link">Library</a>
						<a href="/history" class="nav-link">History</a>
						{#if data.user.role === 'admin'}
							<a href="/admin" class="nav-link admin-link">Admin</a>
						{/if}
					{/if}
				</nav>

				<div class="header-actions">
					<SearchBar />
					
					<!-- User Menu -->
					<div class="user-menu-container">
						<button 
							class="user-menu-trigger" 
							onclick={(e) => { e.stopPropagation(); toggleUserMenu(); }}
							aria-label="User menu"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						</button>
						
						{#if userMenuOpen}
							<div class="user-dropdown" onclick={(e) => e.stopPropagation()}>
								<div class="user-info">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
										<circle cx="12" cy="7" r="4"/>
									</svg>
									<span class="user-name">{data.user?.username || 'Guest'}</span>
								</div>
								
								<div class="dropdown-divider"></div>
								
								{#if data.user}
									<a href="/library" class="dropdown-item" onclick={closeUserMenu}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
											<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
										</svg>
										Library
									</a>
									<a href="/history" class="dropdown-item" onclick={closeUserMenu}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"/>
											<polyline points="12 6 12 12 16 14"/>
										</svg>
										History
									</a>
									{#if data.user.role === 'admin'}
										<a href="/admin" class="dropdown-item" onclick={closeUserMenu}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
												<circle cx="12" cy="12" r="3"/>
											</svg>
											Admin Panel
										</a>
									{/if}
									<div class="dropdown-divider"></div>
									<button class="dropdown-item logout-item" onclick={handleLogout}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
											<polyline points="16 17 21 12 16 7"/>
											<line x1="21" y1="12" x2="9" y2="12"/>
										</svg>
										Logout
									</button>
								{:else}
									<a href="/login" class="dropdown-item" onclick={closeUserMenu}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
											<polyline points="10 17 15 12 10 7"/>
											<line x1="15" y1="12" x2="3" y2="12"/>
										</svg>
										Sign In
									</a>
									<a href="/register" class="dropdown-item register-item" onclick={closeUserMenu}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
											<circle cx="8.5" cy="7" r="4"/>
											<line x1="20" y1="8" x2="20" y2="14"/>
											<line x1="23" y1="11" x2="17" y2="11"/>
										</svg>
										Register
									</a>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</header>

	<main class="main-content">
		{@render children()}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		position: sticky;
		top: 0;
		background-color: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		z-index: var(--z-sticky);
		padding-top: var(--safe-area-top);
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 var(--spacing-md);
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-md);
		padding: var(--spacing-md) 0;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
	}

	.nav {
		display: none;
		gap: var(--spacing-lg);
	}

	@media (min-width: 768px) {
		.nav {
			display: flex;
		}
	}

	.nav-link {
		font-weight: 500;
		color: var(--color-text-secondary);
		transition: color var(--transition-fast);
	}

	.nav-link:hover {
		color: var(--color-text);
	}

	.admin-link {
		color: #f59e0b;
	}

	.admin-link:hover {
		color: #fbbf24;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.user-menu-container {
		position: relative;
	}

	.user-menu-trigger {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: 50%;
		color: var(--color-text-secondary);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.user-menu-trigger:hover {
		background: var(--color-bg-tertiary);
		color: var(--color-text);
		border-color: var(--color-primary);
	}

	.user-dropdown {
		position: absolute;
		top: calc(100% + var(--spacing-sm));
		right: 0;
		min-width: 200px;
		background: var(--color-bg-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
		z-index: var(--z-dropdown);
		overflow: hidden;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background: var(--color-bg-tertiary);
	}

	.user-info svg {
		color: var(--color-primary);
	}

	.user-name {
		font-weight: 600;
		color: var(--color-text);
	}

	.dropdown-divider {
		height: 1px;
		background: var(--color-border);
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		text-align: left;
		transition: all var(--transition-fast);
		cursor: pointer;
		background: none;
		border: none;
	}

	.dropdown-item:hover {
		background: var(--color-bg-tertiary);
		color: var(--color-text);
	}

	.dropdown-item svg {
		flex-shrink: 0;
	}

	.logout-item:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
	}

	.register-item {
		color: var(--color-primary);
	}

	.register-item:hover {
		background: rgba(99, 102, 241, 0.1);
	}

	.main-content {
		flex: 1;
	}

	@media (max-width: 640px) {
		.header-actions :global(.search-container) {
			display: none;
		}
	}
</style>
