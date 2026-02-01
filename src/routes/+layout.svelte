<script lang="ts">
	import '../app.css';
	import { goto, invalidateAll } from '$app/navigation';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { toast } from '$lib/stores/toast';
	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let userMenuOpen = $state(false);
	let loggingOut = $state(false);
	let dropdownRef = $state<HTMLDivElement | null>(null);
	let triggerRef = $state<HTMLButtonElement | null>(null);

	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function closeUserMenu() {
		userMenuOpen = false;
	}

	// Handle clicks outside the dropdown to close it
	function handleWindowClick(event: MouseEvent) {
		// Only close if clicking outside the dropdown and trigger button
		const target = event.target as Node;
		if (
			userMenuOpen &&
			dropdownRef &&
			triggerRef &&
			!dropdownRef.contains(target) &&
			!triggerRef.contains(target)
		) {
			userMenuOpen = false;
		}
	}

	// Handle navigation link clicks - close menu and let SvelteKit handle navigation
	function handleNavClick() {
		closeUserMenu();
		// Don't prevent default - let SvelteKit's client-side routing work
	}

	// Handle logout using fetch API for SPA-friendly behavior
	async function handleLogout() {
		loggingOut = true;
		closeUserMenu();
		toast.info('Logging out...');

		try {
			const response = await fetch('/auth/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok || response.redirected) {
				toast.success('You have been logged out');
				// Invalidate all data and navigate to home
				await invalidateAll();
				await goto('/', { replaceState: true });
			} else {
				toast.error('Failed to logout. Please try again.');
			}
		} catch (error) {
			toast.error('An error occurred during logout');
		} finally {
			loggingOut = false;
		}
	}
</script>

<!-- Use specific click handler instead of catching all window clicks -->
<svelte:window onclick={handleWindowClick} />

<div class="app">
	<Toast />
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
							bind:this={triggerRef}
							class="user-menu-trigger" 
							onclick={(e) => { e.stopPropagation(); toggleUserMenu(); }}
							aria-label="User menu"
							aria-expanded={userMenuOpen}
							aria-haspopup="true"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
								<circle cx="12" cy="7" r="4"/>
							</svg>
						</button>
						
						{#if userMenuOpen}
							<div 
								bind:this={dropdownRef}
								class="user-dropdown" 
								role="menu"
							>
								<div class="user-info">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
										<circle cx="12" cy="7" r="4"/>
									</svg>
									<span class="user-name">{data.user?.username || 'Guest'}</span>
								</div>
								
								<div class="dropdown-divider"></div>
								
								{#if data.user}
									<a href="/library" class="dropdown-item" role="menuitem" onclick={handleNavClick}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
											<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
										</svg>
										Library
									</a>
									<a href="/history" class="dropdown-item" role="menuitem" onclick={handleNavClick}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<circle cx="12" cy="12" r="10"/>
											<polyline points="12 6 12 12 16 14"/>
										</svg>
										History
									</a>
									{#if data.user.role === 'admin'}
										<a href="/admin" class="dropdown-item" role="menuitem" onclick={handleNavClick}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
												<circle cx="12" cy="12" r="3"/>
											</svg>
											Admin Panel
										</a>
									{/if}
									<div class="dropdown-divider"></div>
									<button 
										class="dropdown-item logout-item" 
										role="menuitem"
										onclick={handleLogout} 
										disabled={loggingOut}
									>
										{#if loggingOut}
											<span class="logout-spinner"></span>
											Logging out...
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
												<polyline points="16 17 21 12 16 7"/>
												<line x1="21" y1="12" x2="9" y2="12"/>
											</svg>
											Logout
										{/if}
									</button>
								{:else}
									<a href="/login" class="dropdown-item" role="menuitem" onclick={handleNavClick}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
											<polyline points="10 17 15 12 10 7"/>
											<line x1="15" y1="12" x2="3" y2="12"/>
										</svg>
										Sign In
									</a>
									<a href="/register" class="dropdown-item register-item" role="menuitem" onclick={handleNavClick}>
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
		text-decoration: none;
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

	.logout-item:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.logout-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(239, 68, 68, 0.3);
		border-top-color: #ef4444;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
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
