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
} from '$lib/rocketPoolContractCalls';

import rocketMinipoolManagerAbi from '../../../../lib/abi/rocketpool/contracts/contract/minipool/RocketMinipoolManager.json';

// Initialize a connection to the Ethereum network
const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

// Create the RocketMinipoolManager contract object
const minipoolManager = await createContract(
	rocketMinipoolManagerAddress,
	rocketMinipoolManagerAbi,
	provider,
	false
);

export async function GET(params) {
	try {
		const nodeAddress = params.url.searchParams.get('nodeAddress');

		// Get minipool data for a single node
		const minipoolCount = await getNodeMiniPoolCount(minipoolManager, nodeAddress);
		const activeMinipoolCount = await getNodeActiveMiniPoolCount(minipoolManager, nodeAddress);
		const finalisedMinipoolCount = await getNodeFinalisedMinipoolCount(
			minipoolManager,
			nodeAddress
		);
		const validatingMinipoolCount = await getNodeValidatingMinipoolCount(
			minipoolManager,
			nodeAddress
		);
		const minipoolAddresses = await getMinipoolAddresses(
			minipoolManager,
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
	} catch (error) {
		console.error(error);
	}
}
