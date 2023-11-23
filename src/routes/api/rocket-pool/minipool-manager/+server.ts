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

export async function GET({ url, setHeaders }) {
	const nodeAddress = url.searchParams.get('nodeAddress');

	setHeaders({
		'cache-control': 'max-age=600'
	});

	try {
		if (nodeAddress != null) {
			// Get the minipool metadata (but not individual pool data)

			// Get minipool data for a single node
			const minipoolCount = await getNodeMiniPoolCount(minipoolManagerContract, nodeAddress);

			const activeMinipoolCount = await getNodeActiveMiniPoolCount(
				minipoolManagerContract,
				nodeAddress
			);

			const finalisedMinipoolCount = await getNodeFinalisedMinipoolCount(
				minipoolManagerContract,
				nodeAddress
			);
			const validatingMinipoolCount = await getNodeValidatingMinipoolCount(
				minipoolManagerContract,
				nodeAddress
			);

			// Collect the individual minipool data
			const minipoolAddresses = await getMinipoolAddresses(
				minipoolManagerContract,
				nodeAddress,
				minipoolCount
			);

			return json({
				minipoolCount: minipoolCount,
				activeMinipoolCount: activeMinipoolCount,
				finalisedMinipoolCount: finalisedMinipoolCount,
				validatingMinipoolCount: validatingMinipoolCount,
				minipoolAddresses: minipoolAddresses
			});
		} else {
			console.error('nodeAddress is null');
		}
	} catch (error) {
		console.error(error);
	}
}
