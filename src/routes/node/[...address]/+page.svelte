<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import formatCoinValue from '../../../lib/formatCoinValue';

	export let data: PageData;

	// destructure the server data for easier use
	$: ({ serverData } = data);

	$: ethPrice = 0;
	$: rplPrice = 0;
	$: nodeApiData = {};
	$: minipoolApiData = {};

	onMount(async () => {
		// Get price data from the Coinmarketcap API
		ethPrice = await fetch('../../api/prices/eth').then((res) => res.json());
		rplPrice = await fetch('../../api/prices/rpl').then((res) => res.json());

		// Get node data from the Ethers/Rocket Pool API
		nodeApiData = await fetch(
			`../../api/rocket-pool/rocket-node-manager?nodeAddress=${serverData.address}`
		).then((res) => res.json());

		// Get minipool data from the Ethers/Rocket Pool API
		minipoolApiData = await fetch(
			`../../api/rocket-pool/minipool-manager?nodeAddress=${serverData.address}`
		).then((res) => res.json());
	});
</script>

<h1>Rocket Pool Node: {serverData.address}</h1>

<p><b>eth price for testing: {ethPrice}</b></p>
<h2>Metadata</h2>
<p>Registered on {serverData.formattedRegistrationDate} in {serverData.timezone}.</p>
<p>Smoothing Pool: Opted {nodeApiData.smoothingPoolRegistrationState ? 'In' : 'Out'}</p>

<h2>Balances</h2>
<h3>Node Wallet</h3>
<p>
	ETH Balance: {formatCoinValue(nodeApiData.balanceETH, 4)} (${(
		formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	RPL Balance: {formatCoinValue(nodeApiData.balanceRPL, 4)} RPL (${(
		formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>

<h3>Staked RPL</h3>
<p>
	Minimum RPL Stake: {formatCoinValue(nodeApiData.minimumRPLStake, 0)} (${(
		formatCoinValue(nodeApiData.minimumRPLStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	Maximum RPL Stake: {formatCoinValue(nodeApiData.maximumRPLStake, 0)} (${(
		formatCoinValue(nodeApiData.maximumRPLStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	Current RPL Stake: {formatCoinValue(nodeApiData.rplStake, 0)} (${(
		formatCoinValue(nodeApiData.rplStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
	<span class="belowMinimumWarning">
		{nodeApiData.rplStake < nodeApiData.minimumRPLStake ? '(below minimum)' : ''}
	</span>
</p>

<h3>Total Value</h3>
<p>
	Total Value: ${(
		formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice +
		formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice +
		formatCoinValue(nodeApiData.rplStake, 6) * rplPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
</p>

<h2>Minipools</h2>
<p>Minipools Total: {minipoolApiData.minipoolCount}</p>
<p>Minipools Active: {minipoolApiData.activeMinipoolCount}</p>
<p>Minipools Validating: {minipoolApiData.validatingMinipoolCount}</p>
<p>Minipools Finalized: {minipoolApiData.finalisedMinipoolCount}</p>

<!-- {#each minipoolApiData.minipoolAddresses as pool}
	<p>{pool}</p>
{/each} -->

<style>
	h1 {
		font-size: 1.5rem;
	}
	span.belowMinimumWarning {
		color: #f06203;
	}
</style>
