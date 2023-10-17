<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	/** @type {import('./$types').ActionData} */

	// This allows you to access data that was loaded from +page.server.ts
	export let data: { nodeAddress: string };
</script>

<svelte:head>
	<title>Rocket Pool Node and Minipool Dashboard</title>
	<meta
		name="description"
		content="View data for Rocket Pool staking nodes. See the node balance, unclaimed earnings, and minipool earnings."
	/>
</svelte:head>

<h1>Get Data For Any Rocket Pool Node</h1>
<h4>Search for your node to see staking and minipool data.</h4>
<p class="centered">
	(or <a
		href="/node/0x01454230a4a4b1188fB38e502829096218643978"
		data-umami-event="click_random_node">try a random node</a
	>).
</p>

<AddressForm />

<div class="recentNodes">
	{#if data.nodeAddress != undefined}
		<h3>Return to Your Last Search</h3>
		<p>
			<a href="/node/{data.nodeAddress}" data-umami-event="click_recent_node">{data.nodeAddress}</a>
		</p>
	{/if}
</div>

<style>
	/* Homepage styles */
	.recentNodes {
		margin-top: 120px;
		text-align: center;
	}
</style>
