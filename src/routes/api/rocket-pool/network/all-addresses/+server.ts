import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';

import { createContract } from '$lib/rocketPoolContractCalls';

import { rocketNodeManagerAddress } from '$lib/smartContractAddresses';
import rocketNodeManagerAbi from '$lib/abi/rocketpool/contracts/contract/node/RocketNodeManager.json';

// Initialize a connection to the Ethereum network
const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

const rocketNodeManagerContract = await createContract(
	rocketNodeManagerAddress,
	rocketNodeManagerAbi,
	provider,
	false
);

export async function GET() {
	const networkNodeCount = await rocketNodeManagerContract.getNodeCount();
	const allNodeAddresses = await rocketNodeManagerContract.getNodeAddresses(0, networkNodeCount);

	const allNodeAddressesArray = [];

	// Create an object for each node address that the prerender function can use to generate a static page
	for (const address of allNodeAddresses) {
		allNodeAddressesArray.push({ address: address });
	}

	return json({
		allNodeAddressesArray
	});
}
