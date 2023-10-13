<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import formatCoinValue from '../../../lib/formatCoinValue';

	export let data: PageData;

	// destructure the server data for easier use
	$: ({ node, minipools } = data);

	$: ethPrice = 0;
	$: rplPrice = 0;

	onMount(async () => {
		ethPrice = await fetch('../../api/prices/eth').then((res) => res.json());
		rplPrice = await fetch('../../api/prices/rpl').then((res) => res.json());
	});
</script>

<h1>Rocket Pool Node: {node.address}</h1>

<p><b>eth price for testing: {ethPrice}</b></p>
<h2>Metadata</h2>
<p>Registered on {node.formattedRegistrationDate} in {node.timezone}.</p>
<p>Smoothing Pool: Opted {node.smoothingPoolRegistrationState ? 'In' : 'Out'}</p>

<h2>Balances</h2>
<h3>Node Wallet</h3>
<p>
	ETH Balance: {formatCoinValue(node.balanceETH, 4)} (${(
		formatCoinValue(node.balanceETH, 6) * ethPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	RPL Balance: {formatCoinValue(node.balanceRPL, 4)} RPL (${(
		formatCoinValue(node.balanceRPL, 6) * rplPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>

<h3>Staked RPL</h3>
<p>
	Minimum RPL Stake: {formatCoinValue(node.minimumRPLStake, 0)} (${(
		formatCoinValue(node.minimumRPLStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	Maximum RPL Stake: {formatCoinValue(node.maximumRPLStake, 0)} (${(
		formatCoinValue(node.maximumRPLStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
</p>
<p>
	Current RPL Stake: {formatCoinValue(node.rplStake, 0)} (${(
		formatCoinValue(node.rplStake, 2) * rplPrice
	).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
	<span class="belowMinimumWarning">
		{node.rplStake < node.minimumRPLStake ? '(below minimum)' : ''}
	</span>
</p>

<h3>Total Value</h3>
<p>
	Total Value: ${(
		formatCoinValue(node.balanceETH, 6) * ethPrice +
		formatCoinValue(node.balanceRPL, 6) * rplPrice +
		formatCoinValue(node.rplStake, 6) * rplPrice
	).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
