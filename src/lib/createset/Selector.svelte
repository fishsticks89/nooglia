<script lang="ts">
	import Selector from './ui/selector.svelte';
	import splitterlist from './splitters';
	export let selector: {
		reset: () => void;
		getSplitters: () => { termdef: RegExp | string; entries: RegExp | string };
		setTermDefSplitter: (index: number) => void;
	};
	let splitters = [true, false, false, false];
	let splitters2 = [true, false, false, false];
	selector.reset = () => {
		splitters = [true, false, false, false];
		splitters2 = [true, false, false, false];
	};
	let tx1: string;
	let tx2: string;
	selector.setTermDefSplitter = (ind) => {
		splitters = splitters.map((e, i) => {
			return i == ind;
		});
	};
	selector.getSplitters = () => {
		const [termdefindex, entryindex] = [splitters, splitters2].map((splitter) => {
			let index = 0;
			splitter.forEach((e, i) => {
				if (e) index = i;
			});
			return index;
		});
		let termdef: RegExp | string;
		let entries: RegExp | string;
		switch (termdefindex) {
			case 0:
				termdef = splitterlist.comma;
				break;
			case 1:
				termdef = splitterlist.tab;
				break;
			case 2:
				termdef = splitterlist.newline;
				break;
			case 3:
				termdef = tx1;
				break;
			default:
				termdef = splitterlist.comma;
				break;
		}
		switch (entryindex) {
			case 0:
				entries = splitterlist.newline;
				break;
			case 1:
				entries = splitterlist.tab;
				break;
			case 2:
				entries = splitterlist.doublenewline;
				break;
			case 2:
				entries = tx2;
				break;
			default:
				entries = splitterlist.newline;
				break;
		}
		return { termdef, entries };
	};
	const select = (i: number) => {
		splitters = splitters.map((_, i2) => {
			return i == i2;
		});
	};
	const select2 = (i: number) => {
		splitters2 = splitters2.map((_, i2) => {
			return i == i2;
		});
	};
</script>

<div class="holder">
	<div class="selectorlist">
		<p class="info">Between Term and Defininiton</p>
		<Selector
			selected={splitters[0]}
			on:click={() => {
				select(0);
			}}
			text={'Comma'}
		/>
		<Selector
			selected={splitters[1]}
			on:click={() => {
				select(1);
			}}
			text={'Tab'}
		/>
		<Selector
			selected={splitters[2]}
			on:click={() => {
				select(2);
			}}
			text={'Newline'}
		/>
		<Selector
			selected={splitters[3]}
			on:click={() => {
				select(3);
			}}
		>
			Custom:&nbsp;<input type="text" bind:value={tx1} />
		</Selector>
	</div>
	<div class="selectorlist">
		<p class="info">Between Cards</p>
		<Selector
			selected={splitters2[0]}
			on:click={() => {
				select2(0);
			}}
			text={'Newline'}
		/>
		<Selector
			selected={splitters2[1]}
			on:click={() => {
				select2(1);
			}}
			text={'Tab'}
		/>
		<Selector
			selected={splitters2[2]}
			on:click={() => {
				select2(2);
			}}
			text={'Double Newline'}
		/>
		<Selector
			selected={splitters2[3]}
			on:click={() => {
				select2(3);
			}}
		>
			Custom:&nbsp;<input type="text" bind:value={tx2} />
		</Selector>
	</div>
</div>

<style>
	input {
		background: transparent;
		border: 0px solid transparent;
		margin: 0px;
		padding: 3px;
		border-radius: 0px;
		resize: none;

		height: 1em;

		border-bottom: 2px solid rgba(255, 255, 255, 0.2);
	}
	input::placeholder {
		color: rgba(255, 255, 255, 0.2);
	}
	input:focus-visible {
		outline: none;
	}
	input:focus {
		border-bottom: 4px solid var(--comp);
	}
	.holder {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
		height: fit-content;
	}
	.selectorlist {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: flex-start;
		height: fit-content;
	}
	.info {
		margin-left: 1.5rem;
	}
</style>
