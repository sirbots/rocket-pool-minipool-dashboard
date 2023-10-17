<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import MinipoolDetailsTable from '$lib/components/MinipoolDetailsTable.svelte';
	import Jumper from '$lib/components/spinners/Jumper.svelte';

	import formatCoinValue from '$lib/formatCoinValue';

	interface PageData {
		nodeAddress: string;
		formattedRegistrationDate: string;
		timezone: string;
	}

	export let data: PageData;

	const spinnerSize = 25;

	$: ethPrice = 0;
	$: rplPrice = 0;
	$: nodeApiData = {
		status: 'loading',
		balanceETH: 0n,
		balanceRPL: 0n,
		rplStake: 0n,
		effectiveRPLStake: 0n,
		minimumRPLStake: 0n,
		maximumRPLStke: 0n,
		minipoolCount: 0n,
		ethMatched: 0n,
		smoothingPoolRegistrationState: false
	};
	$: minipoolApiData = {
		minipoolCount: 0,
		activeMinipoolCount: 0,
		finalisedMinipoolCount: 0,
		validatingMinipoolCount: 0,
		// TO DO: Build out the empty minipools object so we have the types
		minipools: 'loading'
	};

	$: minipoolBalance = {
		totalUnclaimed: 0,
		nodeUnclaimed: 0,
		userUnclaimed: 0,
		refundBalance: 0,
		nodeStaked: 0
	};

	$: nodeDollarValue =
		formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice +
		formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice +
		formatCoinValue(nodeApiData.rplStake, 6) * rplPrice;
	$: minipoolDollarValue = minipoolDollarValue =
		(formatCoinValue(minipoolBalance.nodeStaked, 6) +
			formatCoinValue(minipoolBalance.nodeUnclaimed, 6)) *
		ethPrice;
	$: totalDollarValue = nodeDollarValue + minipoolDollarValue;

	$: belowMinimumStake = false;

	onMount(async () => {
		// Get price data from the Coinmarketcap API
		ethPrice = await fetch('../../api/prices/eth').then((res) => res.json());
		rplPrice = await fetch('../../api/prices/rpl').then((res) => res.json());

		// Get node data from the Ethers/Rocket Pool API
		nodeApiData = await fetch(
			`../../api/rocket-pool/rocket-node-manager?nodeAddress=${data.nodeAddress}`
		).then((res) => res.json());

		// Get minipool data from the Ethers/Rocket Pool API
		minipoolApiData = await fetch(
			`../../api/rocket-pool/minipool-manager?nodeAddress=${data.nodeAddress}`
		).then((res) => res.json());

		// Helpers functions to aggregate the minipool data
		async function aggregateMinipoolData(minipools) {
			for (const pool of minipools) {
				// Update the minipoolBalance
				minipoolBalance.totalUnclaimed += pool.balance;
				minipoolBalance.nodeUnclaimed += pool.nodeShare;
				minipoolBalance.userUnclaimed += pool.userShare;
				minipoolBalance.refundBalance += pool.nodeRefundBalance;

				// Calculate the total ETH owned by the node owner
				minipoolBalance.nodeStaked += pool.nodeDepositBalance;
			}
		}

		await aggregateMinipoolData(minipoolApiData.minipools);

		if (nodeApiData.rplStake < nodeApiData.minimumRPLStake) {
			belowMinimumStake = true;
		}
	});
</script>

{#if data.message !== 'invalid-node-address'}
	<h1>Rocket Pool Node</h1>
	<div class="prices">
		<div class="priceBox">
			<span class="highlight-blue">ETH</span>
			{ethPrice.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}
		</div>
		<div class="priceBox">
			<span class="highlight">RPL</span> ${rplPrice.toLocaleString('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			})}
		</div>
	</div>

	<p>
		The node at <span class="highlight">{data.nodeAddress}</span> was registered on {data.formattedRegistrationDate}
		in {data.timezone}. It is currently opted
		{#if nodeApiData.smoothingPoolRegistrationState == true}
			into
		{:else if nodeApiData.smoothingPoolRegistrationState == false}
			out of
		{:else}
			<Jumper size={spinnerSize} />
		{/if}
		the smoothing pool.
	</p>

	<p>
		The total operator's share of the node + minipools is
		{#if totalDollarValue == 0}
			<Jumper size={spinnerSize} />
		{:else}
			<span class="highlight"
				>${totalDollarValue.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}</span
			>
		{/if}
	</p>

	<h2>Node Data</h2>

	<p class="centered">
		Total Node Value:
		{#if nodeDollarValue == 0}
			<Jumper size={spinnerSize} />
		{:else}
			<span class="highlight">
				${nodeDollarValue.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</span>
		{/if}
	</p>

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
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceETH, 4).toFixed(4)}
					{/if}
				</td>
				<td>TBD</td>
				<td>
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceETH, 4).toFixed(4)}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading'}
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
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceRPL, 4).toFixed(4)}
					{/if}
				</td>
				<td>TBD</td>
				<td>
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.balanceRPL, 4).toFixed(4)}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading' || rplPrice == 0}
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
				<td>
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.maximumRPLStake, 0)}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading' || rplPrice == 0}
						<Jumper size={spinnerSize} />
					{:else}
						${(formatCoinValue(nodeApiData.maximumRPLStake, 2) * rplPrice).toLocaleString('en-us', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					{/if}
				</td>
				<td>150%</td>
			</tr>
			<tr class={belowMinimumStake ? 'belowMinimum' : ''}>
				<td>Current</td>
				<td>
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.rplStake, 0)}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading' || rplPrice == 0}
						<Jumper size={spinnerSize} />
					{:else}
						${(formatCoinValue(nodeApiData.rplStake, 2) * rplPrice).toLocaleString('en-us', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading' || ethPrice == 0 || rplPrice == 0}
						<Jumper size={spinnerSize} />
					{:else}
						{(
							((formatCoinValue(nodeApiData.rplStake, 2) * rplPrice) /
								(formatCoinValue(nodeApiData.ethMatched, 0) * ethPrice)) *
							100
						).toFixed(1)}%
					{/if}
				</td>
			</tr>
			<tr>
				<td>Minimum</td>
				<td>
					{#if nodeApiData.status == 'loading'}
						<Jumper size={spinnerSize} />
					{:else}
						{formatCoinValue(nodeApiData.minimumRPLStake, 0)}
					{/if}
				</td>
				<td>
					{#if nodeApiData.status == 'loading' || rplPrice == 0}
						<Jumper size={spinnerSize} />
					{:else}
						${(formatCoinValue(nodeApiData.minimumRPLStake, 2) * rplPrice).toLocaleString('en-us', {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					{/if}
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

	<MinipoolDetailsTable
		{nodeApiData}
		{minipoolApiData}
		{minipoolBalance}
		{spinnerSize}
		{ethPrice}
		{minipoolDollarValue}
	/>
{:else}
	<h1>Invalid node address</h1>

	<p>
		Are you sure you entered the address correctly? Ethers.js was not able to access node data at <b
			>{data.nodeAddress}.</b
		>
	</p>
	<p>
		Try <a href={`https://etherscan.io/address/${data.nodeAddress}`}
			>looking up the address on Etherscan</a
		> to confirm that it exactly matches what you entered (Etherscan sometimes corrects incorrect capitalizations
		of letters).
	</p>
{/if}

<style>
	h1 {
		margin: 45px 0;
	}
	h2 {
		margin: 80px 0 25px;
	}

	.belowMinimum {
		color: var(--red);
	}

	.prices {
		display: flex;
		justify-content: space-evenly;
		padding: 0 15%;
		margin: 60px 0 40px;
	}

	/* All Tables */
	:global(table) {
		margin: 60px 0 70px;
		border-collapse: collapse;
		width: 100%;
		text-align: center;
	}
	:global(thead) {
		background-color: var(--cream);
		color: var(--black);
	}

	:global(thead th) {
		font-size: 1.5rem;
	}
	:global(thead tr th) {
		background-color: var(--dark-orange);
	}
	:global(thead tr td) {
		padding: 10px 0 0 5px;
		font-weight: bold;
		font-size: 1rem;
		max-width: 75px;
	}
</style>
