<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data } = $props<{ data: PageData }>();

	let title = $state(data.manga.title);
	let description = $state(data.manga.description || '');
	let status = $state<'ongoing' | 'completed' | 'hiatus'>(data.manga.status);
	let selectedGenres = $state<string[]>(data.manga.genres.map((g: { id: string }) => g.id));
	let coverFile = $state<File | null>(null);
	let coverPreview = $state<string | null>(data.manga.coverUrl);
	let submitting = $state(false);
	let error = $state<string | null>(null);

	function generateSlug(title: string): string {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function handleCoverChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			coverFile = file;
			coverPreview = URL.createObjectURL(file);
		}
	}

	function toggleGenre(genreId: string) {
		if (selectedGenres.includes(genreId)) {
			selectedGenres = selectedGenres.filter(id => id !== genreId);
		} else {
			selectedGenres = [...selectedGenres, genreId];
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}

		submitting = true;
		error = null;

		try {
			const formData = new FormData();
			formData.append('title', title.trim());
			formData.append('slug', generateSlug(title));
			formData.append('description', description.trim());
			formData.append('status', status);
			formData.append('genreIds', JSON.stringify(selectedGenres));
			if (coverFile) {
				formData.append('cover', coverFile);
			}

			const response = await fetch(`/api/admin/manga/${data.manga.id}`, {
				method: 'PUT',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				goto(`/admin/manga`);
			} else {
				const err = await response.json();
				error = err.message || 'Failed to update manga';
			}
		} catch (e) {
			error = 'An error occurred';
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit {data.manga.title} - Admin</title>
</svelte:head>

<div class="edit-manga">
	<div class="header">
		<a href="/admin/manga" class="back-link">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M19 12H5M12 19l-7-7 7-7"/>
			</svg>
		</a>
		<h1>Edit Manga</h1>
	</div>

	{#if error}
		<div class="error-message">{error}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-grid">
			<div class="form-main">
				<div class="form-group">
					<label for="title">Title *</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						placeholder="Enter manga title"
						required
					/>
				</div>

				<div class="form-group">
					<label for="description">Description</label>
					<textarea
						id="description"
						bind:value={description}
						placeholder="Enter manga description"
						rows="5"
					></textarea>
				</div>

				<div class="form-group">
					<label for="status">Status</label>
					<select id="status" bind:value={status}>
						<option value="ongoing">Ongoing</option>
						<option value="completed">Completed</option>
						<option value="hiatus">Hiatus</option>
					</select>
				</div>

				<div class="form-group">
					<label>Genres</label>
					<div class="genre-grid">
						{#each data.genres as genre}
							<label class="genre-checkbox">
								<input
									type="checkbox"
									checked={selectedGenres.includes(genre.id)}
									onchange={() => toggleGenre(genre.id)}
								/>
								<span>{genre.name}</span>
							</label>
						{/each}
					</div>
				</div>
			</div>

			<div class="form-sidebar">
				<div class="form-group">
					<label>Cover Image</label>
					<div class="cover-upload">
						{#if coverPreview}
							<img src={coverPreview} alt="Cover preview" class="cover-preview" />
						{:else}
							<div class="cover-placeholder">
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
									<circle cx="8.5" cy="8.5" r="1.5"/>
									<polyline points="21 15 16 10 5 21"/>
								</svg>
								<span>Upload cover</span>
							</div>
						{/if}
						<input
							type="file"
							accept="image/*"
							onchange={handleCoverChange}
							class="cover-input"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="form-actions">
			<a href="/admin/manga" class="btn-secondary">Cancel</a>
			<button type="submit" class="btn-primary" disabled={submitting}>
				{#if submitting}
					Saving...
				{:else}
					Save Changes
				{/if}
			</button>
		</div>
	</form>
</div>

<style>
	.edit-manga {
		max-width: 1000px;
	}

	.header {
		display: flex;
		align-items: center;
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

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
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
	textarea,
	select {
		width: 100%;
		padding: 0.75rem 1rem;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 0.5rem;
		color: #fff;
		font-size: 1rem;
	}

	input[type="text"]:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: #6366f1;
	}

	textarea {
		resize: vertical;
	}

	.genre-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 0.5rem;
	}

	.genre-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: #0a0a0a;
		border: 1px solid #333;
		border-radius: 0.375rem;
		cursor: pointer;
		font-weight: normal;
		margin-bottom: 0;
	}

	.genre-checkbox:has(input:checked) {
		background: #6366f1;
		border-color: #6366f1;
	}

	.genre-checkbox input {
		display: none;
	}

	.cover-upload {
		position: relative;
		aspect-ratio: 3/4;
		background: #0a0a0a;
		border: 2px dashed #333;
		border-radius: 0.5rem;
		overflow: hidden;
		cursor: pointer;
	}

	.cover-upload:hover {
		border-color: #6366f1;
	}

	.cover-preview {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cover-placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		height: 100%;
		color: #666;
	}

	.cover-input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
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
	}

	.btn-primary:hover:not(:disabled) {
		background: #4f46e5;
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.form-sidebar {
			order: -1;
		}

		.cover-upload {
			max-width: 200px;
		}
	}
</style>
