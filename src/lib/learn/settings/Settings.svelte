<script lang="ts">
	import Modal from '$lib/ui/Modal.svelte';
	import showSettings from './showSettings';
	import settingsState from './settingsState';
	import Switch from '$lib/ui/Switch.svelte';
	import Multiselect from '$lib/ui/Multiselect.svelte';

	$settingsState.showFlashcards = false;
</script>

<Modal show={$showSettings} close={() => showSettings.set(false)}>
	<div class="settingsMain">
		<!-- <div class="center">Answer with:</div>
		<Multiselect
			options={['Term', 'Definition', 'Both']}
			selected={$settingsState.answerWith == 'definition'
				? 1
				: $settingsState.answerWith == 'both'
				? 2
				: 0}
			onSelect={(e) => {
				switch (e) {
					case 2:
						$settingsState.answerWith = 'both';
						break;
					case 1:
						$settingsState.answerWith = 'definition';
						break;
					default:
						$settingsState.answerWith = 'term';
						break;
				}
			}}
		/> -->
		<!-- <div class="center">
			Show flashcards: <Switch
				lightBackground={true}
				on={$settingsState.showFlashcards}
				onChange={(x) => {
					$settingsState.showFlashcards = x;
				}}
			/>
		</div> -->
		<div class="center">
			Show multichoice questions: <Switch
				lightBackground={true}
				on={$settingsState.showMultiChoice}
				onChange={(x) => {
					$settingsState.showMultiChoice = x;
				}}
			/>
		</div>
		<div class="center">
			Show write questions: <Switch
				lightBackground={true}
				on={$settingsState.showWrite}
				onChange={(x) => {
					$settingsState.showWrite = x;
				}}
			/>
		</div>
		<hr />
		<div class="center">
			Ignore terms immediately gotten correct: <Switch
				lightBackground={true}
				on={!$settingsState.grindset}
				onChange={(x) => {
					$settingsState.grindset = !x;
				}}
			/>
		</div>
		<!-- <div class="center">
			Occasionally ask older questions: <Switch
				lightBackground={true}
				on={$settingsState.retrieve}
				onChange={(x) => {
					$settingsState.retrieve = x;
				}}
			/>
		</div> -->
	</div>
</Modal>

<style>
	hr {
		margin-top: 1rem;
		color: var(--glasser);
		width: 90%;
		margin-left: 5%;
	}
	.settingsMain {
		width: 100%;
		height: fit-content;
		overflow-y: visible;
		overflow-x: hidden;
		box-shadow: inset 0px 0px 5px var(--emp);
		padding-bottom: 1rem;
	}
	.center {
		margin-top: 1rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: calc(100% - 2rem);
		margin-left: 1rem;
	}
</style>
