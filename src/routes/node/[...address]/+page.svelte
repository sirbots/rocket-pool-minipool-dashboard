<script>
	// import data generated on the server
	export let data;

	// import helpers
	import formatCoinValue from '../../../lib/formatCoinValue';

	// destructure the server data for easier use
	let { node, minipools, prices } = data;

	const registrationDate = new Date(Number(node.registrationTime) * 1000);
	const formattedRegistrationDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(registrationDate);
</script>

<h1>Rocket Pool Node: {node.address}</h1>

<h2>Metadata</h2>
<p>Timezone: {node.timezone}</p>
<p>Registration Time: {formattedRegistrationDate}</p>
<p>Smoothing Pool: Opted {node.smoothingPoolRegistrationState ? 'In' : 'Out'}</p>

<h2>Balances</h2>
<h3>Node Wallet</h3>
<p>
	ETH Balance: {formatCoinValue(node.balanceETH, 4)} (${(
		formatCoinValue(node.balanceETH, 6) * prices.eth
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	RPL Balance: {formatCoinValue(node.balanceRPL, 4)} RPL (${(
		formatCoinValue(node.balanceRPL, 6) * prices.rpl
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>

<h3>Staked RPL</h3>
<p>Minimum RPL Stake: {formatCoinValue(node.minimumRPLStake, 0)}</p>
<p>Maximum RPL Stake: {formatCoinValue(node.maximumRPLStake, 0)}</p>
<p>Current RPL Stake: {formatCoinValue(node.rplStake, 0)}</p>
<p>
	Effective RPL Stake: {formatCoinValue(node.effectiveRPLStake, 0)}
	<span class="belowMinimumWarning">
		{node.rplStake < node.minimumRPLStake ? '(below minimum)' : ''}
	</span>
</p>

<h3>Total Value</h3>
<p>
	Total Value: ${(
		formatCoinValue(node.balanceETH, 6) * prices.eth +
		formatCoinValue(node.balanceRPL, 6) * prices.rpl +
		formatCoinValue(node.rplStake, 6) * prices.rpl
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

	<!-- console.log(formattedNumber); // Outputs: "13,518.24" -->
</p>
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
	span.belowMinimumWarning {
		color: #f06203;
	}
</style>
