<script lang="ts">
	export let defaultText: string;

	let tx: HTMLTextAreaElement; // the elem
	export let funcs: { get: () => string; reset: () => void };
	export let onPaste = (contents: string) => {};
	export let onChange = (contents: string) => {};
	let text: string; // curr contents
	funcs.get = () => {
		return text;
	};
	funcs.reset = () => {
		text = '';
	};

	function init(text: HTMLTextAreaElement) {
		function resize() {
			onChange(text.value);
			text.style.height = 'auto';
			text.style.height = text.scrollHeight + 1 + 'px';
		}
		/* 0-timeout to get the already changed text */
		function delayedResize() {
			window.setTimeout(resize, 0);
		}
		text.addEventListener('change', resize);
		text.addEventListener('cut', delayedResize);
		text.addEventListener('paste', delayedResize);
		text.addEventListener('drop', delayedResize);
		text.addEventListener('keydown', delayedResize);
		window.addEventListener('resize', delayedResize);

		text.addEventListener('paste', () => {
			setTimeout(() => onPaste(tx.value));
		});

		// make tab work
		text.addEventListener('keydown', function (e) {
			if (e.key == 'Tab') {
				e.preventDefault();
				var start = this.selectionStart;
				var end = this.selectionEnd;

				// set textarea value to: text before caret + tab + text after caret
				this.value = this.value.substring(0, start) + '\t' + this.value.substring(end);

				// put caret at right position again
				this.selectionStart = this.selectionEnd = start + 1;
			}
		});

		resize();
	}

	setTimeout(() => {
		init(tx);
	});
</script>

<textarea bind:this={tx} bind:value={text} data-hj-allow placeholder={defaultText} />

<style>
	textarea::placeholder {
		font-family: 'Montserrat', sans-serif;
		color: var(--light);
	}
	textarea {
		font-family: 'Montserrat', sans-serif;

		margin-top: 0rem;
		margin-bottom: 1rem;

		padding: 1rem;
		padding-bottom: 0.1rem;

		margin-left: 1rem;
		width: 70%;

		resize: none;
		background-color: var(--emp);

		border-width: 0px;
		border-radius: var(--round);

		max-width: 50rem;
		max-height: 70vh;
	}
	textarea:focus-visible {
		outline: none;
	}
</style>
