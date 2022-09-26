<script lang="ts">
	import { flip } from 'svelte/animate';
	import Term from './term.svelte';
	import { toTerm, termToString, type term } from '$lib/data/db';

	import type { setStore } from '$lib/data/setStore';
	import Learn from '$lib/learn/Learn.svelte';
	import { writable, type Writable } from 'svelte/store';
	import Name from './name.svelte';
	import Importterms from './importterms.svelte';
	
	export let state: setStore;

	let terms: Writable<(term & { id: string })[]> = writable([]);

	// writes state to terms
	state.subscribe((stat) => {
		if (stat.set.contents.length === 0) {
			state.update((stat2) => {
				stat2.set.contents = ['\n'];
				return stat2;
			});
		}
		const newterms = stat.set.contents.map((e) => {
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
			$state.set.contents.length != newterms.length ||
			$state.set.contents.filter((e, i) => {
				return e != newterms[i];
			}).length !== 0
		)
			state.update((stat) => {
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
</script>

<!-- name -->
{#if $state.isEditing}
	<Name {state} />
{:else}
	<h1>{$state.set.name}</h1>
{/if}

<button
	class="edit"
	on:click={() => {
		if ($state.set.name === '') alert('Name Your Set!');
		else if (
			$state.set.contents.length < 4 ||
			$state.set.contents
				.join('')
				.split(/[\n ]+/)
				.join('').length <= 1
		)
			alert('You must have at least 4 unique terms');
		else
			state.update((s) => {
				s.isEditing = !s.isEditing;
				return s;
			});
	}}>{$state.isEditing ? 'Done' : 'Edit'}</button
>
{#if $state.isEditing}
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
	<Importterms
		addTerms={(tt) => {
			onUpdate([...tt, ...$terms]);
		}}
	/>
{:else}
	<Learn terms={$terms.filter((e) => e && (e.q != '' || e.a != ''))} {state} />
{/if}

{#each $state.isEditing ? $terms : $terms.filter((e) => e && (e.q != '' || e.a != '')) as term, i (term.id)}
	<div class="termholder" animate:flip={{ duration: 200 }}>
		<Term
			{state}
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
{#if $state.isEditing}
	<button
		class="add"
		on:click={() => {
			terms.update((tms) => {
				return [...tms, { q: '', a: '', id: Math.random().toString() }];
			});
		}}
	>
		<span class="material-icons-round">add</span>
	</button>
{/if}

<style>
	h1 {
		font-family: 'Gilroy', sans-serif;

		width: 100%;
		margin: 0px;
		margin-bottom: 1rem;

		padding: 0px;
		padding-bottom: 5px;

		font-size: calc(4vw + 1rem);
	}
	.edit {
		font-family: 'GilroyBold', sans-serif;
		background-color: vaR(--light);
		color: var(--emp);
		padding: 0.6rem;
		padding-inline: 1.4rem;

		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.si {
		font-size: 1.7rem;
	}
	.swap {
		color: white;
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
</style>
