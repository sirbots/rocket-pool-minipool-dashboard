<script>
	import { getMinipoolAddresses } from '$lib/rocketPoolContractCalls';

	// import data generated on the server
	export let data;

	// destructure the server data for easier use
	let { node, minipools, prices } = data;

	const registrationDate = new Date(Number(node.registrationTime) * 1000);
	const formattedRegistrationDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(registrationDate);

	console.log(formattedRegistrationDate);
</script>

<h1>Rocket Pool Node: {node.address}</h1>

<h2>Node Data</h2>
<h3>Metadata</h3>
<p>Timezone: {node.timezone}</p>
<p>Registration Time: {formattedRegistrationDate}</p>
<p>rplStake: {node.rplStake}</p>
<p>effectiveRPLStake: {node.effectiveRPLStake}</p>
<p>minimumRPLStake: {node.minimumRPLStake}</p>
<p>maximumRPLStake: {node.maximumRPLStake}</p>
<p>ethMatched: {node.ethMatched}</p>
<p>ethMatchedLimit: {node.ethMatchedLimit}</p>

<p>distributorBalanceUserETH: {node.distributorBalanceUserETH}</p>
<p>distributorBalanceNodeETH: {node.distributorBalanceNodeETH}</p>
<p>smoothingPoolRegistrationState: {node.smoothingPoolRegistrationState}</p>

<p>ETH Balance: {node.balanceETH} ETH ({`$${node.balanceETH * prices.eth}`})</p>
<p>RPL Balance: {node.balanceRPL} RPL ({`$${node.balanceRPL * prices.rpl}`})</p>

<h3>Bond/Insurance Stats</h3>
<p>insert insurance data here</p>

<h2>Minipools</h2>
<p>Minipools Total: {node.minipoolsTotal}</p>
<p>Minipools Active: {node.minipoolsActive}</p>
<p>Minipools Validating: {node.minipoolsValidating}</p>
<p>Minipools Finalized: {node.minipoolsFinalized}</p>

{#each node.minipoolAddresses as pool}
	<p>{pool}</p>
{/each}

<style>
	h1 {
		font-size: 1.5rem;
	}
</style>
