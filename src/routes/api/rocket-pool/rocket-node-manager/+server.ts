import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';
import { rocketNodeManagerAddress } from '$lib/smartContractAddresses';

import {
	createContract,
	getNodeDetails,
	getSmoothingPoolRegistrationState
} from '$lib/rocketPoolContractCalls';

import rocketNodeManagerAbi from '../../../../lib/abi/rocketpool/contracts/contract/node/RocketNodeManager.json';

// Initialize a connection to the Ethereum network
const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

const rocketNodeManagerContract = await createContract(
	rocketNodeManagerAddress,
	rocketNodeManagerAbi,
	provider,
	false
);

export async function GET(params) {
	try {
		const nodeAddress = params.url.searchParams.get('nodeAddress');
		const nodeDetails = await getNodeDetails(rocketNodeManagerContract, nodeAddress);
		const smoothingPoolRegistrationState = await getSmoothingPoolRegistrationState(
			rocketNodeManagerContract,
			nodeAddress
		);

		return json({
			balanceETH: Number(nodeDetails.balanceETH),
			balanceRPL: Number(nodeDetails.balanceRPL),
			rplStake: Number(nodeDetails.rplStake),
			effectiveRPLStake: Number(nodeDetails.effectiveRPLStake),
			minimumRPLStake: Number(nodeDetails.minimumRPLStake),
			maximumRPLStake: Number(nodeDetails.maximumRPLStake),
			minipoolCount: Number(nodeDetails.minipoolCount),
			smoothingPoolRegistrationState: smoothingPoolRegistrationState
		});
	} catch (error) {
		console.error(error);
	}
}
