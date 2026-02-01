<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { data } = $props<{ data: PageData }>();

	let chapterNumber = $state(data.nextChapterNumber);
	let title = $state('');
	let pageFiles = $state<File[]>([]);
	let pagePreviews = $state<string[]>([]);
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let uploadProgress = $state(0);

	function handleFilesChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (files) {
			// Sort files by name
			const sortedFiles = Array.from(files).sort((a, b) => 
				a.name.localeCompare(b.name, undefined, { numeric: true })
			);
			pageFiles = sortedFiles;
			pagePreviews = sortedFiles.map(file => URL.createObjectURL(file));
		}
	}

	function removeFile(index: number) {
		pageFiles = pageFiles.filter((_, i) => i !== index);
		pagePreviews = pagePreviews.filter((_, i) => i !== index);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (pageFiles.length === 0) {
			error = 'Please add at least one page';
			toast.error('Please add at least one page');
			return;
		}

		submitting = true;
		error = null;
		uploadProgress = 0;

		try {
			const formData = new FormData();
			formData.append('mangaId', data.manga.id);
			formData.append('mangaSlug', data.manga.slug);
			formData.append('chapterNumber', String(chapterNumber));
			formData.append('title', title.trim());
			formData.append('slug', `chapter-${chapterNumber}`);
			
			pageFiles.forEach((file, index) => {
				formData.append('pages', file);
			});

			const response = await fetch('/api/admin/chapters', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				toast.success(`Chapter ${chapterNumber} has been created successfully!`);
				goto(`/admin/manga/${data.manga.slug}/chapters`);
			} else {
				const err = await response.json();
				error = err.message || 'Failed to create chapter';
				toast.error(error ?? 'Failed to create chapter');
			}
		} catch (e) {
			error = 'An error occurred';
			toast.error('An error occurred while creating the chapter');
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Add Chapter - {data.manga.title} - Admin</title>
</svelte:head>

<div class="new-chapter">
	<div class="header">
		<a href="/admin/manga/{data.manga.slug}/chapters" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</a>
		<div>
			<h1>Add New Chapter</h1>
			<p class="manga-title">{data.manga.title}</p>
		</div>
	</div>

	{#if error}
		<div class="error-message">{error}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-row">
			<div class="form-group">
				<label for="chapterNumber">Chapter Number *</label>
				<input
					type="number"
					id="chapterNumber"
					bind:value={chapterNumber}
					min="1"
					required
					disabled={submitting}
				/>
			</div>
			<div class="form-group flex-1">
				<label for="title">Title (optional)</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					placeholder="e.g. The Beginning"
					disabled={submitting}
				/>
			</div>
		</div>

		<div class="form-group">
			<label>Pages *</label>
			<div class="upload-area" class:disabled={submitting}>
				<input
					type="file"
					accept="image/*"
					multiple
					onchange={handleFilesChange}
					class="file-input"
					disabled={submitting}
				/>
				<div class="upload-content">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
						<polyline points="17 8 12 3 7 8"/>
						<line x1="12" y1="3" x2="12" y2="15"/>
					</svg>
					<p>Click or drag to upload page images</p>
					<span>Images will be sorted by filename</span>
				</div>
			</div>
		</div>

		{#if pagePreviews.length > 0}
			<div class="pages-preview">
				<h3>Pages ({pagePreviews.length})</h3>
				<div class="pages-grid">
					{#each pagePreviews as preview, index}
						<div class="page-item">
							<span class="page-number">{index + 1}</span>
							<img src={preview} alt="Page {index + 1}" />
							<button type="button" class="remove-btn" onclick={() => removeFile(index)} disabled={submitting}>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<line x1="18" y1="6" x2="6" y2="18"/>
									<line x1="6" y1="6" x2="18" y2="18"/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<div class="form-actions">
			<a href="/admin/manga/{data.manga.slug}/chapters" class="btn-secondary">Cancel</a>
			<button type="submit" class="btn-primary" disabled={submitting}>
				{#if submitting}
					<span class="spinner"></span>
					<span>Uploading...</span>
				{:else}
					Upload Chapter
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.new-chapter {
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

	input[type="text"]:disabled,
	input[type="number"]:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	input[type="number"] {
		width: 120px;
	}

	.upload-area {
		position: relative;
		border: 2px dashed #333;
		border-radius: 0.5rem;
		padding: 3rem 2rem;
		text-align: center;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.upload-area:hover:not(.disabled) {
		border-color: #6366f1;
	}

	.upload-area.disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.file-input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.file-input:disabled {
		cursor: not-allowed;
	}

	.upload-content {
		pointer-events: none;
		color: #666;
	}

	.upload-content svg {
		margin-bottom: 1rem;
	}

	.upload-content p {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.upload-content span {
		font-size: 0.875rem;
	}

	.pages-preview {
		margin-top: 1.5rem;
	}

	.pages-preview h3 {
		font-size: 1rem;
		font-weight: 600;
		color: #fff;
		margin-bottom: 1rem;
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

	.remove-btn {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 24px;
		height: 24px;
		background: #dc2626;
		border: none;
		border-radius: 0.25rem;
		color: #fff;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.remove-btn:disabled {
		opacity: 0 !important;
		cursor: not-allowed;
	}

	.page-item:hover .remove-btn:not(:disabled) {
		opacity: 1;
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
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.btn-primary:hover:not(:disabled) {
		background: #4f46e5;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
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
