import { json } from '@sveltejs/kit';
import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';

import {
	createContract,
	getNodeDetails,
	getSmoothingPoolRegistrationState
} from '$lib/rocketPoolContractCalls';

import rocketNodeManagerAbi from '../../../../lib/abi/rocketpool/contracts/contract/node/RocketNodeManager.json';

// Initialize a connection to the Ethereum network
const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

const rocketNodeManagerContract = await createContract(
	'0x89F478E6Cc24f052103628f36598D4C14Da3D287',
	rocketNodeManagerAbi,
	provider,
	false
);

export async function GET(params) {
	const nodeAddress = params.url.searchParams.get('nodeAddress');
	const nodeDetails = await getNodeDetails(rocketNodeManagerContract, nodeAddress);
	const smoothingPoolRegistrationState = await getSmoothingPoolRegistrationState(
		rocketNodeManagerContract,
		nodeAddress
	);

	const registrationDate = new Date(Number(nodeDetails.registrationTime) * 1000);
	const formattedRegistrationDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(registrationDate);

	return json({
		timezone: nodeDetails.timezoneLocation,
		formattedRegistrationDate: formattedRegistrationDate,
		balanceETH: Number(nodeDetails.balanceETH),
		balanceRPL: Number(nodeDetails.balanceRPL),
		rplStake: Number(nodeDetails.rplStake),
		effectiveRPLStake: Number(nodeDetails.effectiveRPLStake),
		minimumRPLStake: Number(nodeDetails.minimumRPLStake),
		maximumRPLStake: Number(nodeDetails.maximumRPLStake),
		minipoolCount: Number(nodeDetails.minipoolCount),
		smoothingPoolRegistrationState: smoothingPoolRegistrationState
	});
}
