<script lang="ts">
	import { squish } from '$lib/transitions/squish';
	import Runner from '../util/Runner.svelte';
	import { flip } from 'svelte/animate';
	import Term from './term.svelte';
	import { toTerm, termToString, type term } from '$lib/data/db';

	import type { setStore } from '$lib/data/setStore';
	import Learn from '$lib/learn/learn.svelte';
	import { writable, type Writable } from 'svelte/store';
	import Name from './name.svelte';
	import Importterms from './importterms.svelte';
	import printStore from '$lib/util/print/printStore';

	export let docStore: setStore;

	let terms: Writable<(term & { id: string })[]> = writable([]);

	// writes state to terms
	docStore.subscribe((doc) => {
		if (doc.set.contents.length === 0) {
			docStore.update((stat2) => {
				stat2.set.contents = ['\n'];
				return stat2;
			});
		}
		const newterms = doc.set.contents.map((e) => {
			const term = toTerm(e);
			return { ...term, id: Math.random().toString() };
		});
		if (
			$terms.length != newterms.length ||
			$terms.filter((e, i) => {
				return e.q != newterms[i].q || e.a != newterms[i].a;
			}).length !== 0
		)
			terms.set(newterms);
	});

	// writes terms to state
	const onUpdate = (tms: term[]) => {
		const newterms = tms.map((e) => termToString(e));
		if (
			$docStore.set.contents.length != newterms.length ||
			$docStore.set.contents.filter((e, i) => {
				return e != newterms[i];
			}).length !== 0
		)
			docStore.update((stat) => {
				stat.set.contents = newterms;
				return stat;
			});
	};
	let focused = {
		x: true,
		y: 0
	};
	const onPress = (ev: KeyboardEvent) => {
		switch (ev.key) {
			case 'Enter':
				ev.preventDefault();
				if (focused.x) {
					focused.x = false;
				} else {
					focused.x = true;
					focused.y++;
				}
				break;
		}
		if (0 > focused.y) focused.y = 0;
		if ($terms.length - 1 < focused.y)
			terms.update((tms) => {
				focused.y = $terms.length;
				return [...tms, { q: '', a: '', id: Math.random().toString() }];
			});
	};
	let width: number = 0;
	let importpop = false;

	$: isEditing = $docStore.isEditing && $docStore.isEditable;
</script>

<svelte:window bind:innerWidth={width} />

<div class="create">
	<!-- name -->
	{#if isEditing}
		<Name state={docStore} />
	{:else}
		<h1>{$docStore.set.name}</h1>
	{/if}
	<div class="setButtons">
		{#if $docStore.isEditable}
			<button
				class="edit"
				on:click={() => {
					if ($docStore.set.name === '') alert('Name Your Set!');
					else if (
						$docStore.set.contents.length < 4 ||
						$docStore.set.contents
							.join('')
							.split(/[\n ]+/)
							.join('').length <= 1
					)
						alert('You must have at least 4 unique terms');
					else
						docStore.update((s) => {
							s.isEditing = !s.isEditing;
							return s;
						});
				}}>{$docStore.isEditing ? 'Done' : 'Edit'}</button
			>
		{/if}
		{#if !isEditing}
			<button class="share edit"
				on:click={() => {
					navigator.clipboard.writeText(window.location.href);
					alert("Copied Link!")
				}}
				>Share <span class="material-icons-round shareico">content_copy</span></button
			>
		{/if}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if $docStore.isEditing}
		<button
			class="swap"
			on:click={() => {
				onUpdate(
					$terms.map((term) => {
						term = { q: term.a, a: term.q, id: Math.random().toString() };
						return term;
					})
				);
			}}
		>
			<span class="si material-icons-round">swap_horiz</span>
		</button>
		<button
			class="clearall"
			on:click={() => {
				onUpdate([]);
			}}
		>
			Clear all&nbsp;<span class="si material-icons-round">delete</span>
		</button>
		<Runner
			enter={() => {
				importpop = false;
			}}
		/>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="import"
			style:margin-top={width > 900 ? '-2rem' : '0rem'}
			on:click={() => {
				importpop = !importpop;
			}}
		>
			+ Import from Word, Google Docs, Excel, etc
		</div>
	{:else}
		<Learn terms={$terms.filter((e) => e && (e.q != '' || e.a != ''))} state={docStore} />
		<button
			class="printstudy"
			out:squish={{ initialheight: '2.5rem' }}
			on:click={() => {
				printStore.set(true);
			}}><span class="material-icons-round pri">print</span>print study</button
		>
	{/if}

	{#each isEditing ? $terms : $terms.filter((e) => e && (e.q != '' || e.a != '')) as term, i (term.id)}
		<div class="termholder" animate:flip={{ duration: 200 }}>
			<Term
				isEditing={isEditing}
				{terms}
				{onUpdate}
				{term}
				{onPress}
				selected={focused.y == i ? focused.x : null}
				setSelected={(p) => {
					focused.y = i;
					focused.x = p;
				}}
			/>
		</div>
	{/each}
	{#if isEditing}
		<button
			class="add"
			on:click={() => {
				terms.update((tms) => {
					return [...tms, { q: '', a: '', id: Math.random().toString() }];
				});
				focused.x = true;
				focused.y = $terms.length - 1;
			}}
		>
			<span class="material-icons-round">add</span>
		</button>
	{/if}
</div>
{#if $docStore.isEditing}
	<Importterms
		{importpop}
		addTerms={(tt) => {
			onUpdate([...tt, ...$terms]);
		}}
	/>
{/if}

<style>
	.pri {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
	}
	.printstudy {
		position: relative;
		width: 100%;
		border-radius: var(--round);
		border: 2px solid black;
		padding-block: 0.5rem;
		background-color: var(--light);
		color: black;
		font-family: 'PoppinsSemi', sans-serif;
		height: 2.5rem;
	}
	h1 {
		font-family: 'PoppinsSemi', sans-serif;

		width: 100%;
		margin: 0px;
		margin-bottom: 1rem;

		padding: 0px;
		padding-bottom: 5px;

		font-size: calc(4vw + 1rem);
	}
	.setButtons {
		display: flex;
		justify-content: space-between;
	}
	.edit {
		font-family: 'PoppinsSemi', sans-serif;
		background-color: var(--light);
		color: var(--emp);
		padding: 0.6rem;
		padding-inline: 1.4rem;

		display: flex;
		flex-direction: row;
		align-items: center;

		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.shareico {
		font-size: 1.3rem;
		padding-left: 0.3rem;
		/* transform: translateY(-10%); */
	}
	.share {
		color: var(--lighter);
		background-color: var(--emp);
	}
	.si {
		font-size: 1.7rem;
	}
	.clearall {
		color: var(--lighter);
		background-color: var(--emp);

		margin: 0rem;
		position: absolute;
		right: 0%;
		transform: translateY(-140%);

		height: 2.5rem;
		width: fit-content;
		padding-inline: 1rem;

		display: flex;
		justify-content: center;
		align-items: center;

		border: 0px solid white;
		border-radius: var(--round);

		font-family: 'PoppinsSemi', sans-serif;
	}
	.swap {
		color: var(--light);
		background-color: var(--emp);

		margin: 1rem;
		position: relative;
		left: 50%;
		transform: translateX(-50%);

		height: 3rem;
		width: 3rem;

		display: flex;
		justify-content: center;
		align-items: center;

		border: 0px solid white;
		border-radius: 10000vw;
	}
	.import {
		appearance: none;
		/* filter: brightness(150%) saturate(150%); */
		color: var(--light);
		background-color: var(--background);
		border: 0px;
		margin: 0px;
		font-weight: 600;
		font-family: 'PoppinsSemi', sans-serif;
		cursor: pointer;

		padding-inline: 0.7rem;
		text-align: left;
		margin-top: -2rem;
		margin-bottom: 1rem;

		border-radius: var(--round);
	}
	.termholder {
		position: relative;

		height: fit-content;
		width: 100%;
		margin-block: 0.5rem;
		background-color: var(--emp);
		border-radius: var(--round);

		display: flex;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: left;
	}
	.add {
		padding: 0px;

		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		width: 2.5rem;

		background-color: rgba(255, 255, 255, 0.2);

		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.add:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}
	.create {
		width: calc(70vw + 8vh);
		max-width: 50rem;
		height: fit-content;
		margin: 0px;
		margin-left: 50vw;
		transform: translateX(-50%);
		padding-top: 3rem;

		overflow: visible;
	}
</style>