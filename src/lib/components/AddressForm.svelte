<script lang="ts">
	// Create a variable to store the input address from the form
	$: inputAddress = '';

	// Validate the input to ensure that it's a valid Ethereum EOA address
	const ethereumEOARegex = /^(0x)?[0-9a-fA-F]{40}$/;
	$: addressValid = ethereumEOARegex.test(inputAddress.trim());

	// Should we show the error message? Only if the address is not valid.
	$: showInvalidAddressError = false;

	function handleInput(event: Event) {
		inputAddress = (event.target as HTMLInputElement).value;
	}

	function handleBlur() {
		// If the address is invalid, display an error message, but only once they leave the focus of the input field (on:blur).
		showInvalidAddressError = true;
	}
</script>

<div class="formWrapper">
	<form method="POST" action="?/setAddress">
		<input
			type="text"
			name="nodeAddress"
			value={inputAddress}
			placeholder="Enter your node address here..."
			on:input={handleInput}
			on:blur={handleBlur}
		/>

		<button type="submit" disabled={!addressValid}>View Node</button>
	</form>
</div>
<div class="errorBox">
	{#if !addressValid && showInvalidAddressError}
		<p>That doesn't look like a valid Ethereum address. Are you sure you entered it correctly?</p>
	{/if}
</div>

<style>
	.formWrapper {
		display: flex;
		flex-direction: row;

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
