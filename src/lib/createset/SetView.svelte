<script lang="ts">
	import { squish } from "$lib/transitions/squish";
	import Runner from "../util/Runner.svelte";
	import { flip } from "svelte/animate";
	import Term from "./term.svelte";

	import Learn from "$lib/learn/learn.svelte";
	import Name from "./name.svelte";
	import Importterms from "./importterms.svelte";
	import printStore from "$lib/util/print/printStore";
	import type { docSub } from "$lib/core/doc";
	import { authState } from "$lib/auth/authState";

	export let docStore: docSub;

	let focused = {
		left: true,
		item: 0,
	};

	const onPress = (ev: KeyboardEvent) => {
		switch (ev.key) {
			case "Enter":
				ev.preventDefault();
				if (focused.left) {
					focused.left = false;
				} else {
					focused.left = true;
					focused.item++;
				}
				break;
		}
		if (0 > focused.item) focused.item = 0;
		if ($docStore.terms.length - 1 < focused.item)
			docStore.set({
				terms: $docStore.terms.concat({
					q: "",
					a: "",
					id: Math.random().toString(),
				}),
			});
	};
	let width: number = 0;
	let importpop = false;

	$: isEditable = $docStore.uid === $authState?.uid;

	const enoughTerms = () => {
		const duplicates =
			$docStore.terms.filter(
				(e) => $docStore.terms.filter((f) => f.q == e.q).length > 1
			).length / 2;
		return $docStore.terms.length - duplicates >= 4;
	};

	let isEditing = isEditable && !enoughTerms();
</script>

<svelte:window bind:innerWidth={width} />

<div class="create">
	<!-- name -->
	{#if isEditing}
		<Name state={docStore} />
	{:else}
		<h1>{$docStore.name}</h1>
	{/if}
	<div class="setButtons">
		{#if isEditable}
			<button
				class="edit"
				on:click={() => {
					if (!enoughTerms() && isEditing)
						alert("You must have at least 4 unique questions");
					else isEditing = !isEditing;
				}}>{isEditing ? "Done" : "Edit"}</button
			>
		{/if}
		{#if !isEditing}
			<button
				class="share edit"
				on:click={() => {
					navigator.clipboard.writeText(window.location.href);
					alert("Copied Link!");
				}}
				>Share <span class="material-icons-round shareico"
					>content_copy</span
				></button
			>
		{/if}
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	{#if isEditing}
		<button
			class="swap"
			on:click={() => {
				docStore.set({
					terms: $docStore.terms.map((e) => {
						return {
							q: e.a,
							a: e.q,
							id: e.id,
						};
					}),
				});
			}}
		>
			<span class="si material-icons-round">swap_horiz</span>
		</button>
		<button
			class="clearall"
			on:click={() => {
				const should = confirm(
					"Are you sure you want to delete all terms?"
				);
				if (should) docStore.set({ terms: [] });
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
			style:margin-top={width > 900 ? "-2rem" : "0rem"}
			on:click={() => {
				importpop = !importpop;
			}}
		>
			+ Import from Word, Google Docs, Excel, etc
		</div>
	{:else}
		{#key $docStore.id}
			<Learn
				terms={$docStore.terms.filter(
					(e) => e && (e.q != "" || e.a != "")
				)}
			/>
		{/key}
		<button
			class="printstudy"
			out:squish={{ initialheight: "2.5rem" }}
			on:click={() => {
				printStore.set(true);
			}}
			><span class="material-icons-round pri">print</span>print study</button
		>
	{/if}

	{#each isEditing ? $docStore.terms : $docStore.terms.filter((e) => e && (e.q != "" || e.a != "")) as term, i (term.id)}
		<div class="termholder" animate:flip={{ duration: 200 }}>
			<Term
				{isEditing}
				{term}
				{onPress}
				selected={focused.item == i ? focused.left : null}
				setSelected={(p) => {
					focused.item = i;
					focused.left = p;
				}}
				onChange={(e) => {
					if (e == null) {
						docStore.set({
							terms: $docStore.terms.filter((f, termIndex) => {
								return termIndex != i;
							}),
						});
					} else {
						docStore.set({
							terms: $docStore.terms.map((f) => {
								if (f == term) return e;
								return f;
							}),
						});
					}
				}}
			/>
		</div>
	{/each}

	{#if isEditing}
		<button
			class="add"
			on:click={() => {
				docStore.set(
					{
						terms: $docStore.terms.concat({
							q: "",
							a: "",
							id: Math.random().toString(),
						}),
					},
					true
				);
				focused.left = true;
				focused.item = $docStore.terms.length - 1;
			}}
		>
			<span class="material-icons-round">add</span>
		</button>
	{/if}
</div>
{#if isEditing}
	<Importterms
		{importpop}
		addTerms={(tt) => {
			docStore.set({
				terms: $docStore.terms.concat(tt),
			});
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
		height: 2.5rem;
		border-radius: var(--round);
		padding-block: 0.5rem;

		border: 0px solid transparent;

		background-color: var(--lighter);
		color: var(--emp);
		font-family: "PoppinsSemi", sans-serif;
	}
	h1 {
		font-family: "PoppinsSemi", sans-serif;
		font-weight: normal;

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
		font-family: "PoppinsSemi", sans-serif;
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

		font-family: "PoppinsSemi", sans-serif;
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
		font-family: "PoppinsSemi", sans-serif;
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

		color: var(--light);
		background-color: var(--emp);

		border: 0px solid transparent;
		border-radius: var(--round);
	}
	.add:hover {
		background-color: rgba(255, 255, 255, 0.3);
	}
	.create {
		width: calc(70vw + 8vh);
		max-width: min(50rem, 90vw);
		height: fit-content;
		margin: 0px;
		margin-left: 50vw;
		transform: translateX(-50%);
		padding-top: 3rem;

		overflow: visible;
	}
</style>
