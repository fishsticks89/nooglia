<script lang="ts">
	import { authState } from '$lib/auth/authState';

	let feedback = false;
	let txt = '';
</script>

<div
	class="feedback"
	on:click={() => {
		feedback = !feedback;
	}}
>
	FEEDBACK
</div>

{#if feedback}
	<div class="bkg">
		<textarea bind:value={txt} name="feedback" placeholder="Type your feedback..." class="fdbk" />
	</div>
	<button
		class="submit"
		on:click={() => {
			feedback = false;

			const request = new XMLHttpRequest();
			request.open(
				'POST',
				'https://discord.com/api/webhooks/1020528830995255376/V9UtjobBchnvB_yyTwi12ykPOTx1dHwpAOE6UTkaXQ21jFqmaNFdbaw1ZbN3DARllspZ'
			);
			request.setRequestHeader('Content-type', 'application/json');
			const params = {
				content:
					'email: **' + ($authState ? $authState.email : 'unknown') + '**\n```\n' + txt + '\n```'
			};
			request.send(JSON.stringify(params));
			txt = '';
		}}>Send</button
	>
	<button
		class="x"
		on:click={() => {
			feedback = false;

			const request = new XMLHttpRequest();
			request.open(
				'POST',
				'https://discord.com/api/webhooks/1020528830995255376/V9UtjobBchnvB_yyTwi12ykPOTx1dHwpAOE6UTkaXQ21jFqmaNFdbaw1ZbN3DARllspZ'
			);
			request.setRequestHeader('Content-type', 'application/json');
			const params = {
				content:
					'email: **' + ($authState ? $authState.email : 'unknown') + '**\n```\n' + txt + '\n```'
			};
			request.send(JSON.stringify(params));
			txt = '';
		}}><span class="material-icons-round">close</span></button
	>
{/if}

<style>
	.x {
		position: fixed;
		top: 1rem;
		left: 1rem;

		outline: 0px solid white;
		border: 0px solid white;
		border-radius: var(--round);

		text-align: center;
		background-color: transparent;
		font-size: 0.6rem;
	}
	.bkg {
		position: fixed;
		top: 0rem;
		left: 0rem;
		width: 100vw;
		height: 100vh;

		background-color: var(--background);
	}
	.submit {
		position: fixed;
		bottom: 1rem;
		right: 1rem;

		background-color: var(--accent);

		outline: 0px solid white;
		border: 0px solid white;
		border-radius: var(--round);

		padding: 0.6rem;
		padding-inline: 1.4rem;
	}
	.fdbk {
		position: fixed;
		top: 10vh;
		left: 10vw;
		width: calc(80vw - 2rem);
		height: calc(80vh - 2rem);
		padding: 1rem;

		background-color: var(--emp);

		resize: none;
		outline: 0px solid white;
		border: 0px solid white;
		border-radius: var(--round);
	}
	.fdbk:focus {
		outline: 0px solid white;
		border: 0px solid white;
	}
	.feedback {
		appearance: none;
		/* filter: brightness(150%) saturate(150%); */
		color: var(--light);
		background-color: var(--background);
		border: 0px;
		margin: 2vw;
		font-weight: 600;
		font-family: 'PoppinsSemi', sans-serif;
		cursor: pointer;

		padding: 0.7rem;
		text-align: right;
		right: 0rem;
		bottom: 0px;
		position: fixed;

		border-radius: var(--round);
	}
</style>
