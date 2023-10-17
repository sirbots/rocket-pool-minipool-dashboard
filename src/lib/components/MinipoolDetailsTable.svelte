<script lang="ts">
	import { onMount } from 'svelte';
	import formatCoinValue from '$lib/formatCoinValue';
	import Jumper from '$lib/components/spinners/Jumper.svelte';

	export let nodeApiData: object;
	export let minipoolApiData: object;
	export let minipoolBalance: object;
	export let spinnerSize: number;
	export let ethPrice: number;
	export let minipoolDollarValue: number;

	// Helpers
	function truncateAddress(address) {
		return address.slice(0, 6) + '...' + address.slice(-4);
	}
</script>

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
		{#if minipoolApiData.minipoolCount == 'loading'}
			<Jumper size={spinnerSize} />
		{:else}
			{minipoolApiData.minipoolCount}
		{/if}
	</li>
	<li>
		Active:
		{#if minipoolApiData.minipoolCount == 'loading'}
			<Jumper size={spinnerSize} />
		{:else}
			{minipoolApiData.activeMinipoolCount}
		{/if}
	</li>
	<li>
		Validating:
		{#if minipoolApiData.minipoolCount == 'loading'}
			<Jumper size={spinnerSize} />
		{:else}
			{minipoolApiData.validatingMinipoolCount}
		{/if}
	</li>
	<li>
		Finalized:
		{#if minipoolApiData.minipoolCount == 'loading'}
			<Jumper size={spinnerSize} />
		{:else}
			{minipoolApiData.finalisedMinipoolCount}
		{/if}
	</li>
</ul>

<!-- Display minipool data if the API call is complete -->
{#if minipoolApiData.minipools !== 'loading'}
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
			{#each minipoolApiData.minipools as pool}
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
		</tbody>
	</table>
{:else}
	<!-- Display the table in loading state while waiting for the API call to complete -->
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
				<td><Jumper size={spinnerSize} /> </td>
				<td><Jumper size={spinnerSize} /></td>
				<td><Jumper size={spinnerSize} /></td>
			</tr>
			{#each { length: nodeApiData.minipoolCount } as _}
				<tr>
					<td>0x00.....0000</td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
					<td><Jumper size={spinnerSize} /></td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	h2 {
		margin: 90px 0 30px;
	}

	ul.minipoolStatusList {
		display: flex;
		justify-content: space-between;
		list-style: none;
		padding: 0 10%;
		margin: 20px 0 40px;
	}
</style>
