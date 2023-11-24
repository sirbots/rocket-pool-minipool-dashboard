<script lang="ts">
	// This isn't active yet.

	$: inputEmail = '';
	$: inputMessage = 'Enter your message here...';

	function handleInput(event: Event) {
		inputEmail = (event.target as HTMLInputElement).value;
		inputMessage = (event.target as HTMLTextAreaElement).value;
	}
</script>

<form method="POST" action="?/setAddress">
	<input type="email" name="email" value={inputEmail} on:input={handleInput} />
	<textarea name="message" value={inputMessage} on:input={handleInput} />

	<button type="submit" disabled={false}>Send Message</button>
</form>

<!-- <div class="errorBox">
	{#if !addressValid && showInvalidAddressError}
		<p>That doesn't look like a valid Ethereum address. Are you sure you entered it correctly?</p>
	{/if}
</div> -->

<style>
	form {
		display: flex;
		flex-direction: column;

		justify-content: center;
		align-items: center;
		margin: 50px 0 30px 0;
	}
	input {
		font: inherit;
		border: none;
		outline: none;
		border-radius: var(--standard-radius);
		padding: 5px 10px;
		height: 30px;
		min-width: 400px;
	}
	input:focus-visible {
		outline: none;
	}

	button {
		font: inherit;
		color: var(--cream);
		border: 1px solid var(--black);
		background-color: var(--black);
		padding: 8px 10px;
		width: 115px;
		height: 95%;
		box-shadow: none;
	}
	button:hover {
		color: var(--black);
		background-color: var(--cream);
		cursor: pointer;
	}

	.errorBox {
		display: flex;
		flex-direction: row;
		justify-content: center;
		height: px;
	}
	.errorBox p {
		width: 50%;
		border: dotted 2px var(--red);
		border-radius: var(--standard-radius);
		font-size: 1.1rem;
		color: var(--red);

		padding: 12px 28px;
	}
</style>
