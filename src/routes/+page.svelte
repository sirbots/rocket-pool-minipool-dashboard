<script lang="ts">
	import AddressForm from '$lib/components/AddressForm.svelte';
	/** @type {import('./$types').ActionData} */

	// This allows you to access data that was loaded from +page.server.ts
	export let data: { nodeAddress: string };
</script>

<h1>Rocket Pool Solo Staker Dashboard</h1>

<AddressForm />

<div class="recentNodes">
	<h3>Recently Viewed Nodes</h3>
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
