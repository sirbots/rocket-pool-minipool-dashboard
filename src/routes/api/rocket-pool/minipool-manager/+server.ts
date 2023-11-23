import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';
import { rocketMinipoolManagerAddress } from '$lib/smartContractAddresses';

import {
	createContract,
	getNodeMiniPoolCount,
	getNodeActiveMiniPoolCount,
	getNodeFinalisedMinipoolCount,
	getNodeValidatingMinipoolCount,
	getMinipoolAddresses
	// getNodeDepositBalance
} from '$lib/rocketPoolContractCalls';

import rocketMinipoolManagerAbiJson from '$lib/abi/rocketpool/contracts/contract/minipool/RocketMinipoolManager.json';
import genericMinipooContractAbiJson from '$lib/abi/GenericMinipoolContract.json';

// Initialize a connection to the Ethereum network
const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

const genericMinipooContractAbi = new ethers.Interface(genericMinipooContractAbiJson);
const rocketMinipoolManagerAbi = new ethers.Interface(rocketMinipoolManagerAbiJson);

// Create the RocketMinipoolManager contract object
const minipoolManagerContract = await createContract(
	rocketMinipoolManagerAddress,
	rocketMinipoolManagerAbi,
	provider,
	false
);

interface Minipool {
	address: string;
	balance: number;
	nodeDepositBalance: number;
	nodeRefundBalance: number;
	minipoolCommissionRate: number;
	nodeShare: number;
	userShare: number;
}

const minipools: Minipool[] = [];

// Delay function to retry when there's trouble getting data from a minipool
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getIndividualMinipoolData(minipoolAddresses: string[]) {
	try {
		// Iterate through the minipool addresses and get the minipool details
		for (const minipoolAddress of minipoolAddresses) {
			console.log(`Gathering minipool data for ${minipoolAddress}`);

			// Create a minipool contract object so we can get the minipool's delegate
			const minipoolContract = new ethers.Contract(
				minipoolAddress,
				genericMinipooContractAbi,
				provider
			);

			// Get the address of the minipool's delegate contract
			// Note: the minipool contract delegates most of its functionality to a delegate contract. The actual functions of the minipool contract are limited, and we need to use the ABI from the delegate contract in order to really interact with the minipool contract and get the data we need.
			const delegateAddress = await minipoolContract.getDelegate();
			let delegateAbi;

			// Use the etherscan API to get the ABI for the delegate contract

			const response = await fetch(
				`https://api.etherscan.io/api?module=contract&action=getabi&address=${delegateAddress}&apikey=${env.ETHERSCAN_API_KEY}`
			);
			const delegateAbiResponse = await response.json();

			if (delegateAbiResponse.status === '1') {
				delegateAbi = JSON.parse(delegateAbiResponse.result);
			}

			// Create a new minipool contract, now with the delegate contract's ABI. This will allow us to get the minipool's balance and other data (see note above).
			const minipoolWithDelegateAbi = new ethers.Contract(minipoolAddress, delegateAbi, provider);

			// Get the minipool details
			const balance = await provider.getBalance(minipoolAddress);
			// How much ETH (in WEI) the node operator has deposited into the minipool at creation
			const nodeDepositBalance = await minipoolWithDelegateAbi.getNodeDepositBalance();
			// How much ETH (in WEI) came from Rocket Pool users to top off the minipool balance at 32 ETH
			// const userDepositBalance = await minipoolWithDelegateAbi.getUserDepositBalance();
			// Commission paid to the node operator
			const minipoolCommissionRate = await minipoolWithDelegateAbi.getNodeFee();
			// The node refund balance (in WEI). To be honest, I'm not sure what this represents, but I believe it's ETH that the node has claim to (without having to share it with the minipool users). However, I'm not sure in what cases it would go above 0.
			const nodeRefundBalance = await minipoolWithDelegateAbi.getNodeRefundBalance();
			// The node operator's share of the minipool's balance
			const nodeShare = await minipoolWithDelegateAbi.calculateNodeShare(balance);
			// The users' share of the minipool's balance
			const userShare = balance - nodeShare;

			// Let's take all our data and put it into a nice little object for later viewing
			minipools.push({
				address: minipoolAddress,
				balance: Number(balance),
				nodeDepositBalance: Number(nodeDepositBalance),
				nodeRefundBalance: Number(nodeRefundBalance),
				minipoolCommissionRate: Number(minipoolCommissionRate),
				nodeShare: Number(nodeShare),
				userShare: Number(userShare)
				// userDepositBalance: Number(userDepositBalance),
			});
		}
	} catch (error) {
		console.error(error);
		console.log('Retrying...');
		await delay(1000); // Wait 1 second before trying again
		return getMinipoolData(minipoolAddresses); // Retry the operation
	}
}

// Get minipool data for a single node
let minipoolCount: number | undefined;
let activeMinipoolCount: number | undefined;
let finalisedMinipoolCount: number | undefined;
let validatingMinipoolCount: number | undefined;

// Collect the individual minipool data
let minipoolAddresses: string[] | undefined;

async function getMinipoolData(nodeAddress: string) {
	try {
		// Get minipool data for a single node
		minipoolCount = await getNodeMiniPoolCount(minipoolManagerContract, nodeAddress);
		activeMinipoolCount = await getNodeActiveMiniPoolCount(minipoolManagerContract, nodeAddress);
		finalisedMinipoolCount = await getNodeFinalisedMinipoolCount(
			minipoolManagerContract,
			nodeAddress
		);
		validatingMinipoolCount = await getNodeValidatingMinipoolCount(
			minipoolManagerContract,
			nodeAddress
		);

		// Collect the individual minipool data
		minipoolAddresses = await getMinipoolAddresses(
			minipoolManagerContract,
			nodeAddress,
			minipoolCount
		);
	} catch (error) {
		console.error(error);
		console.log('Retrying...');
		await delay(1000); // Wait 1 second before trying again
		return getMinipoolData(); // Retry the operation
	}
}

export async function GET({ url, setHeaders }) {
	const nodeAddress = url.searchParams.get('nodeAddress');

	try {
		if (nodeAddress != null) {
			// Get the minipool metadata (but not individual pool data)
			await getMinipoolData(nodeAddress);
		}

		if (minipoolAddresses === undefined) {
			await delay(1000);
			console.log('minipoolAddresses is undefinied. Killing the operation.');
		} else {
			// Get the individual minipool data
			await getIndividualMinipoolData(minipoolAddresses);
		}

		setHeaders({
			'cache-control': 'max-age=600'
		});

		return json({
			minipoolCount: minipoolCount,
			activeMinipoolCount: activeMinipoolCount,
			finalisedMinipoolCount: finalisedMinipoolCount,
			validatingMinipoolCount: validatingMinipoolCount,
			minipools: minipools
		});
	} catch (error) {
		console.error(error);
	}
}
