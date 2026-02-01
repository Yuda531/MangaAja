<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toast';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let loading = $state(false);

	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Register | MangaAja</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<div class="auth-header">
			<a href="/" class="logo">MangaAja</a>
			<h1>Create account</h1>
			<p>Join MangaAja today</p>
		</div>

		{#if form?.error}
			<div class="error-message">{form.error}</div>
		{/if}

		<form 
			method="POST" 
			class="auth-form"
			use:enhance={() => {
				loading = true;
				return async ({ result, update }) => {
					loading = false;
					if (result.type === 'redirect') {
						toast.success('Account created successfully! Welcome to MangaAja!');
					}
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
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="username">Username</label>
				<input 
					type="text" 
					id="username" 
					name="username" 
					required
					minlength="3"
					maxlength="20"
					autocomplete="username"
					placeholder="Choose a username"
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input 
					type="password" 
					id="password" 
					name="password" 
					required
					minlength="6"
					autocomplete="new-password"
					placeholder="At least 6 characters"
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input 
					type="password" 
					id="confirmPassword" 
					name="confirmPassword" 
					required
					autocomplete="new-password"
					placeholder="Confirm your password"
					disabled={loading}
				/>
			</div>

			<button type="submit" class="submit-btn" disabled={loading}>
				{#if loading}
					<span class="spinner"></span>
					<span>Creating account...</span>
				{:else}
					Create account
				{/if}
			</button>
		</form>

		<p class="auth-footer">
			Already have an account? <a href="/login">Sign in</a>
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

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.submit-btn {
		padding: var(--spacing-md);
		background-color: var(--color-primary);
		color: white;
		font-weight: 600;
		border-radius: var(--radius-md);
		transition: background-color var(--transition-fast);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-sm);
	}

	.submit-btn:hover:not(:disabled) {
		background-color: var(--color-primary-hover);
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
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
