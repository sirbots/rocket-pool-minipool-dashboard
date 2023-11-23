<script lang="ts" context="module">
	declare const umami: Umami;
</script>

<script lang="ts">
	// Types
	import type { MinipoolApiData, Minipool, NodeApiData, Umami } from '$lib/types';

	// Components
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import MinipoolDetailsTable from '$lib/components/MinipoolDetailsTable.svelte';
	import Jumper from '$lib/components/spinners/Jumper.svelte';

	import formatCoinValue from '$lib/formatCoinValue';

	interface PageData {
		message: string;
		nodeAddress: string;
		formattedRegistrationDate: string;
		timezone: string;
	}

	export let data: PageData;

	const spinnerSize = 25;

	let nodeApiData: NodeApiData;
	let minipoolApiData: MinipoolApiData;

	let singleMinipoolDataArray: Minipool[] = [];
	let allMinipoolsLoaded = false;

	$: minipoolBalance = {
		totalUnclaimed: 0,
		nodeUnclaimed: 0,
		userUnclaimed: 0,
		refundBalance: 0,
		nodeStaked: 0
	};

	$: ethPrice = 0;
	$: rplPrice = 0;

	$: nodeApiData = {
		status: 'loading',
		balanceETH: 0,
		balanceRPL: 0,
		rplStake: 0,
		effectiveRPLStake: 0,
		minimumRPLStake: 0,
		maximumRPLStake: 0,
		minipoolCount: 0,
		ethMatched: 0,
		smoothingPoolRegistrationState: false
	};

	$: minipoolApiData = {
		status: 'loading',
		minipoolCount: 0,
		activeMinipoolCount: 0,
		finalisedMinipoolCount: 0,
		validatingMinipoolCount: 0,
		// minipools: []
		minipoolAddresses: []
	};

	$: nodeDollarValue =
		formatCoinValue(nodeApiData.balanceETH, 6) * ethPrice +
		formatCoinValue(nodeApiData.balanceRPL, 6) * rplPrice +
		formatCoinValue(nodeApiData.rplStake, 6) * rplPrice;

	$: minipoolDollarValue =
		(formatCoinValue(minipoolBalance.nodeStaked, 6) +
			formatCoinValue(minipoolBalance.nodeUnclaimed, 6)) *
		ethPrice;

	$: totalDollarValue = nodeDollarValue + minipoolDollarValue;

	$: belowMinimumStake = false;

	$: {
		if (minipoolApiData.status == 'loaded') {
			getAllMinipoolData();
		}
	}
	// Helpers
	function truncateAddress(address: string) {
		return address.slice(0, 6) + '...' + address.slice(-4);
	}

	async function getAllMinipoolData() {
		try {
			for (const address of minipoolApiData.minipoolAddresses) {
				const singleMinipoolData = await fetch(
					`../../api/rocket-pool/minipool-manager/single-minipool-data?minipoolAddress=${address}`
				).then((res) => res.json());

				// Update the minipool data
				singleMinipoolDataArray = [...singleMinipoolDataArray, singleMinipoolData];

				// Update the aggregate data
				minipoolBalance.totalUnclaimed += singleMinipoolData.balance;
				minipoolBalance.nodeUnclaimed += singleMinipoolData.nodeShare;
				minipoolBalance.userUnclaimed += singleMinipoolData.userShare;
				minipoolBalance.refundBalance += singleMinipoolData.nodeRefundBalance;

				// Calculate the total ETH owned by the node owner
				minipoolBalance.nodeStaked += singleMinipoolData.nodeDepositBalance;
			}
			allMinipoolsLoaded = true;
		} catch (error) {
			console.error(error);
		}
	}

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

		minipoolApiData.status = 'loaded';

		if (nodeApiData.rplStake < nodeApiData.minimumRPLStake) {
			belowMinimumStake = true;
		}

		if (data.message == 'invalid-node-address') {
			umami.track('invalid_node_lookup');
		}
	});
</script>

<svelte:head>
	<title>Rocket Pool Node: {data.nodeAddress}</title>
	<meta
		name="description"
		content="View data for the Rocket Pool staking node at {data.nodeAddress}. See the node balance, unclaimed earnings, and minipool earnings."
	/>
</svelte:head>

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

	<h2>Minipools</h2>
	<p class="centered">
		Node Operator Share:
		{#if minipoolDollarValue == 0}
			<Jumper size={spinnerSize} />
		{:else}
			<span class="highlight">
				${minipoolDollarValue.toLocaleString('en-US', {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				})}
			</span>
		{/if}
	</p>

	<ul class="minipoolStatusList">
		<li>
			Total:
			{#if minipoolApiData.status == 'loading'}
				<Jumper size={spinnerSize} />
			{:else}
				{minipoolApiData.minipoolCount}
			{/if}
		</li>
		<li>
			Active:
			{#if minipoolApiData.status == 'loading'}
				<Jumper size={spinnerSize} />
			{:else}
				{minipoolApiData.activeMinipoolCount}
			{/if}
		</li>
		<li>
			Validating:
			{#if minipoolApiData.status == 'loading'}
				<Jumper size={spinnerSize} />
			{:else}
				{minipoolApiData.validatingMinipoolCount}
			{/if}
		</li>
		<li>
			Finalized:
			{#if minipoolApiData.status == 'loading'}
				<Jumper size={spinnerSize} />
			{:else}
				{minipoolApiData.finalisedMinipoolCount}
			{/if}
		</li>
	</ul>

	<!-- Display minipool data if the API call is complete -->

	<table class="minipoolDetails">
		<thead>
			<tr>
				<th colspan="6">Minipool Unclaimed Earnings</th>
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
				<td>{formatCoinValue(minipoolBalance.totalUnclaimed, 4)} </td>
				<td>{formatCoinValue(minipoolBalance.nodeUnclaimed, 4)}</td>
				<td>${(formatCoinValue(minipoolBalance.nodeUnclaimed, 6) * ethPrice).toFixed(2)}</td>
			</tr>
			{#if allMinipoolsLoaded == false}
				<tr>
					<td>0x00.....0000</td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
				</tr>
				{#each singleMinipoolDataArray as pool}
					<tr>
						<td
							><a
								href={`https://etherscan.io/address/${pool.address}`}
								data-umami-event="click_minipool_address">{truncateAddress(pool.address)}</a
							></td
						>
						<td>{formatCoinValue(pool.nodeDepositBalance, 0)}-ETH</td>
						<td>{formatCoinValue(pool.minipoolCommissionRate * 100, 2)}%</td>
						<td>{formatCoinValue(pool.balance, 4).toFixed(4)}</td>
						<td>{formatCoinValue(pool.nodeShare, 4).toFixed(4)}</td>
						<td>${(formatCoinValue(pool.nodeShare, 6) * ethPrice).toFixed(2)}</td>
					</tr>
				{/each}
			{:else}
				{#each singleMinipoolDataArray as pool}
					<tr>
						<td
							><a
								href={`https://etherscan.io/address/${pool.address}`}
								data-umami-event="click_minipool_address">{truncateAddress(pool.address)}</a
							></td
						>
						<td>{formatCoinValue(pool.nodeDepositBalance, 0)}-ETH</td>
						<td>{formatCoinValue(pool.minipoolCommissionRate * 100, 2)}%</td>
						<td>{formatCoinValue(pool.balance, 4).toFixed(4)}</td>
						<td>{formatCoinValue(pool.nodeShare, 4).toFixed(4)}</td>
						<td>${(formatCoinValue(pool.nodeShare, 6) * ethPrice).toFixed(2)}</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
{:else}
	<h1>Invalid node address</h1>

	<p>
		Are you sure you entered the address correctly? Ethers.js was not able to access node data at <b
			>{data.nodeAddress}.</b
		>
	</p>
	<p>
		Try <a
			href={`https://etherscan.io/address/${data.nodeAddress}`}
			data-umami-event="click_Etherscan_lookup">looking up the address on Etherscan</a
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

	ul.minipoolStatusList {
		display: flex;
		justify-content: space-between;
		list-style: none;
		padding: 0 10%;
		margin: 20px 0 40px;
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
		color: var(--white);
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
