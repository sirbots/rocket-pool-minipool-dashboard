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
	$: nodeApiData = 'loading';
	$: minipoolApiData = 'loading';
	$: aggregateBalances = {
		total: 0,
		nodeShare: 0,
		userShare: 0,
		refundBalance: 0
	};
	$: belowMinimumStake = false;

	const spinnerSize = 25;

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

		if (nodeApiData.rplStake < nodeApiData.minimumRPLStake) {
			belowMinimumStake = true;
		}
	});

	// Helpers
	function truncateAddress(address) {
		return address.slice(0, 6) + '...' + address.slice(-4);
	}
</script>

{#if serverData.message !== 'invalid-node-address'}
	<h1>Rocket Pool Node</h1>
	<p>
		The node at <span class="highlight">{serverData.address}</span>, was registered on {serverData.formattedRegistrationDate}
		in {serverData.timezone}. It is currently opted
		{#if nodeApiData.smoothingPoolRegistrationState == true}
			into
		{:else if nodeApiData.smoothingPoolRegistrationState == false}
			out of
		{:else}
			<Jumper size={spinnerSize} />
		{/if}
		the smoothing pool.
	</p>

	<h2>Node Data</h2>

	<h4>
		Total Node Balance:
		{#if nodeApiData == 'loading'}
			<Jumper size={spinnerSize} />
		{:else}
			<span class="highlight">
				${(
					formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice +
					formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice +
					formatCoinValue(nodeApiData.rplStake, 6) * rplPrice
				).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
			</span>
		{/if}
	</h4>

	<table>
		<thead>
			<tr>
				<th colspan="5">Wallet + Unclaimed Rewards</th>
			</tr>
			<tr>
				<td>Asset</td>
				<td>Wallet</td>
				<td>Unclaimed</td>
				<td>Total</td>
				<td>$ Value</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>ETH</td>
				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceETH, 4).toFixed(4)}
					{/if}
				</td>
				<td>TBD</td>
				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceETH, 4).toFixed(4)}
					{/if}
				</td>
				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						${(formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					{/if}
				</td>
			</tr>
			<tr>
				<td>RPL</td>
				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceRPL, 4).toFixed(4)}
					{/if}
				</td>
				<td>TBD</td>
				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceRPL, 4).toFixed(4)}
					{/if}
				</td>

				<td>
					{#if nodeApiData == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						${(formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice).toLocaleString('en-US', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					{/if}
				</td>
			</tr>
		</tbody>
	</table>

	<table>
		<thead>
			<tr>
				<th colspan="4">Staked RPL Collateral</th>
			</tr>
			<tr>
				<td />
				<td>RPL</td>
				<td>$ Value</td>
				<td>%</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Maximum</td>
				<td> {formatCoinValue(nodeApiData.maximumRPLStake, 0)}</td>
				<td
					>${(formatCoinValue(nodeApiData.maximumRPLStake, 2) * rplPrice).toLocaleString('en-us', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</td>
				<td>150%</td>
			</tr>
			<tr class={belowMinimumStake ? 'belowMinimum' : ''}>
				<td>Current</td>
				<td>{formatCoinValue(nodeApiData.rplStake, 0)}</td>
				<td>
					${(formatCoinValue(nodeApiData.rplStake, 2) * rplPrice).toLocaleString('en-us', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</td>
				<td>
					{(
						((formatCoinValue(nodeApiData.rplStake, 2) * rplPrice) /
							(formatCoinValue(nodeApiData.ethMatched, 0) * ethPrice)) *
						100
					).toFixed(1)}%
				</td>
			</tr>
			<tr>
				<td>Minimum</td>
				<td>{formatCoinValue(nodeApiData.minimumRPLStake, 0)}</td>
				<td
					>${(formatCoinValue(nodeApiData.minimumRPLStake, 2) * rplPrice).toLocaleString('en-us', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</td>
				<td>10%</td>
			</tr>
		</tbody>
	</table>

	{#if belowMinimumStake}
		<p style="margin: 30px 0 70px;">
			Your node is under-collateralized. You need to stake an additional {formatCoinValue(
				nodeApiData.minimumRPLStake - nodeApiData.rplStake,
				2
			).toFixed(1)} RPL (~${(
				formatCoinValue(nodeApiData.minimumRPLStake - nodeApiData.rplStake, 2) * rplPrice
			).toLocaleString('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) to begin
			earning RPL staking rewards.
		</p>
	{/if}

	<h2>Minipools</h2>
	<ul class="minipoolStatusList">
		<li>Total: {minipoolApiData.minipoolCount}</li>
		<li>Active: {minipoolApiData.activeMinipoolCount}</li>
		<li>Validating: {minipoolApiData.validatingMinipoolCount}</li>
		<li>Finalized: {minipoolApiData.finalisedMinipoolCount}</li>
	</ul>

	{#if minipoolApiData !== 'loading'}
		<table class="minipoolDetails">
			<thead>
				<tr>
					<th colspan="6">Minipool Details</th>
				</tr>
				<tr>
					<td><b>Minipool</b></td>
					<td><b>Pool Type</b></td>
					<td><b>Commission</b></td>
					<td><b>Balance (ETH)</b></td>
					<td><b>Operator Share (ETH)</b></td>
					<td><b>USD</b></td>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Total</td>
					<td>---</td>
					<td>---</td>
					<td>{formatCoinValue(aggregateBalances.total, 4)} </td>
					<td>{formatCoinValue(aggregateBalances.nodeShare, 4)}</td>
					<td>${(formatCoinValue(aggregateBalances.nodeShare, 6) * ethPrice).toFixed(2)}</td>
				</tr>
				{#each minipoolApiData.minipools as pool}
					<tr>
						<td
							><a href={`https://etherscan.io/address/${pool.address}`}
								>{truncateAddress(pool.address)}</a
							></td
						>
						<td>{formatCoinValue(pool.nodeDepositBalance, 0)}-ETH</td>
						<td>{formatCoinValue(pool.minipoolCommissionRate * 100, 2)}%</td>
						<td>{formatCoinValue(pool.balance, 4).toFixed(4)}</td>
						<td>{formatCoinValue(pool.nodeShare, 4).toFixed(4)}</td>
						<td>${(formatCoinValue(pool.nodeShare, 6) * ethPrice).toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
	h2 {
		margin: 45px 0;
	}
	.highlight {
		background-color: var(--light-orange);
		padding: 4px 9px;
		font-weight: bold;
	}
	.belowMinimum {
		color: var(--red);
	}

	ul.minipoolStatusList {
		display: flex;
		justify-content: space-between;
		list-style: none;
		padding: 0 10%;
		margin: 0;
	}

	/* All Tables */
	table {
		margin: 70px 0 0 0;
		border-collapse: collapse;
		width: 100%;
		text-align: center;
	}
	thead {
		background-color: var(--cream);
		color: var(--black);
	}

	thead th {
		font-size: 1.5rem;
	}
	thead tr th {
		background-color: var(--light-orange);
	}
	thead tr td {
		padding: 10px 0 0 5px;
		font-weight: bold;
		font-size: 1rem;
		max-width: 75px;
	}
</style>
