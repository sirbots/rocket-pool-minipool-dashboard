<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	/** @type {import('./$types').ActionData} */

	// This allows you to access data that was loaded from +page.server.ts
	export let data: { nodeAddress: string };
</script>

<h1>Get Data For Any Rocket Pool Node</h1>
<h4>Search for your node to see staking and minipool data.</h4>

<AddressForm />

<div class="recentNodes">
	<h3>Return to Your Last Search</h3>
	<p><a href="/node/{data.nodeAddress}">{data.nodeAddress}</a></p>
</div>

<style>
	/* Homepage styles */
	/* Don't add too much here in case you switch to Tailwind. */
	.recentNodes {
		margin-top: 120px;
		text-align: center;
	}
</style>
