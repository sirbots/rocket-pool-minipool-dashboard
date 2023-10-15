<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import Jumper from '$lib/components/spinners/Jumper.svelte';

	import formatCoinValue from '../../../lib/formatCoinValue';

	export let data: PageData;

	// destructure the server data for easier use
	$: ({ serverData } = data);

	$: ethPrice = 'loading';
	$: rplPrice = 0;
	$: nodeApiData = {};
	$: minipoolApiData = 'loading';
	$: aggregateBalances = {
		total: 0,
		nodeShare: 0,
		userShare: 0,
		refundBalance: 0
	};

	const spinnerSize = 45;

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

		// Helpers functions to aggregate the minipool data
		async function aggregateMinipoolData(minipools) {
			let total = 0;
			let nodeShare = 0;
			let userShare = 0;
			let refundBalance = 0;

			for (const pool of minipools) {
				total += pool.balance;
				nodeShare += pool.nodeShare;
				userShare += pool.userShare;
				refundBalance += pool.nodeRefundBalance;
			}

			aggregateBalances = {
				total: total,
				nodeShare: nodeShare,
				userShare: userShare,
				refundBalance: refundBalance
			};
		}
		await aggregateMinipoolData(minipoolApiData.minipools);
	});
</script>

{#if serverData.message !== 'invalid-node-address'}
	<h1>Rocket Pool Node: {serverData.address}</h1>

	<h2>Metadata</h2>
	<p>Registered on {serverData.formattedRegistrationDate} in {serverData.timezone}.</p>

	{#if nodeApiData.smoothingPoolRegistrationState == true}
		<p>Smoothing Pool: Opted In</p>
	{:else if nodeApiData.smoothingPoolRegistrationState == false}
		<p>Smoothing Pool: Opted out</p>
	{:else}
		<Jumper size={spinnerSize} />
	{/if}

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

	<p>Unclaimed ETH: TBD</p>
	<p>Unclaimed RPL: TBD</p>

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
	<p>
		RPL Staking Rate: {((nodeApiData.rplStake / nodeApiData.minimumRPLStake) * 100).toFixed(1)}%
	</p>
	<p>
		Required to meet minimum threshold:
		{formatCoinValue(nodeApiData.minimumRPLStake - nodeApiData.rplStake, 2).toFixed(2)} RPL (${(
			formatCoinValue(nodeApiData.minimumRPLStake - nodeApiData.rplStake, 2) * rplPrice
		).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
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

	<h3>Minipool Details</h3>

	<h3>Summary</h3>

	<p><b>All Nodes</b></p>
	<p>Balance: {formatCoinValue(aggregateBalances.total, 6)} ETH (add $ amt)</p>
	<p>Node Operator Share: {formatCoinValue(aggregateBalances.nodeShare, 6)} ETH (add $ amt)</p>
	<p>User Share: {formatCoinValue(aggregateBalances.userShare, 6)} ETH (add $ amt)</p>
	<p>Node Refund Balance: {formatCoinValue(aggregateBalances.refundBalance, 6)} ETH (add $ amt)</p>

	{#if minipoolApiData !== 'loading'}
		{#each minipoolApiData.minipools as pool}
			<p><b>{pool.address}</b></p>
			<p>Balance: {formatCoinValue(pool.balance, 6)} ETH (add $ amt)</p>
			<p>Deposit Type: {formatCoinValue(pool.nodeDepositBalance, 0)}</p>
			<p>Node Refund Balance: {formatCoinValue(pool.nodeRefundBalance, 6)} ETH (add $ amt)</p>
			<p>Commission Rate: {formatCoinValue(pool.minipoolCommissionRate * 100, 2)}%</p>
			<p>nodeShare: {formatCoinValue(pool.nodeShare, 6)} ETH (add $ amt)</p>
			<p>userShare: {formatCoinValue(pool.userShare, 6)} ETH (add $ amt)</p>
		{/each}
	{/if}
{:else}
	<h1>Invalid node address</h1>

	<p>
		Are you sure you entered the address correctly? Ethers.js was not able to access node data at <b
			>{serverData.address}.</b
		>
	</p>
	<p>
		Try <a href={`https://etherscan.io/address/${serverData.address}`}
			>looking up the address on Etherscan</a
		> to confirm that it's correct.
	</p>
{/if}

<style>
	h1 {
		font-size: 1.5rem;
	}
	span.belowMinimumWarning {
		color: #f06203;
	}
</style>
