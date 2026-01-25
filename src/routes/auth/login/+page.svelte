<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Login | MangaAja</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<div class="auth-header">
			<a href="/" class="logo">MangaAja</a>
			<h1>Welcome back</h1>
			<p>Sign in to your account</p>
		</div>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form 
			method="POST" 
			class="auth-form"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					type="email" 
					id="email" 
					name="email" 
					required 
					autocomplete="email"
					placeholder="your@email.com"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input 
					type="password" 
					id="password" 
					name="password" 
					required
					autocomplete="current-password"
					placeholder="Your password"
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={loading}>
				{#if loading}
					Signing in...
				{:else}
					Sign in
				{/if}
			</button>
		</form>

		<p class="auth-footer">
			Don't have an account? <a href="/register">Sign up</a>
		</p>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-md);
		background-color: var(--color-bg);
	}

	.auth-container {
		width: 100%;
		max-width: 400px;
		padding: var(--spacing-2xl);
		background-color: var(--color-bg-secondary);
		border-radius: var(--radius-xl);
	}

	.auth-header {
		text-align: center;
		margin-bottom: var(--spacing-xl);
	}

	.logo {
		display: inline-block;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		margin-bottom: var(--spacing-lg);
	}

	.auth-header h1 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
	}

	.auth-header p {
		color: var(--color-text-secondary);
	}

	.error-message {
		padding: var(--spacing-md);
		background-color: rgba(239, 68, 68, 0.1);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		color: var(--color-error);
		margin-bottom: var(--spacing-lg);
		text-align: center;
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.form-group input {
		padding: var(--spacing-md);
		background-color: var(--color-bg-tertiary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text);
		transition: border-color var(--transition-fast);
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.form-group input::placeholder {
		color: var(--color-text-muted);
	}

	.submit-btn {
		padding: var(--spacing-md);
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast);
	}

	.submit-btn:hover:not(:disabled) {
		background-color: var(--color-primary-hover);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.auth-footer {
		text-align: center;
		margin-top: var(--spacing-xl);
		color: var(--color-text-secondary);
	}

	.auth-footer a {
		color: var(--color-primary);
		font-weight: 500;
	}
</style>
