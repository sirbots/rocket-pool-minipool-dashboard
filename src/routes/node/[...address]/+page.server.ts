import type { EntryGenerator } from './$types';
import type { PageServerLoad } from './$types';

import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';
// Helper functions
import {
	createContract,
	getNodeDetails,
	getNodeMiniPoolCount,
	getNodeActiveMiniPoolCount,
	getNodeFinalisedMinipoolCount,
	getNodeValidatingMinipoolCount,
	getMinipoolAddresses
} from '../../../lib/rocketPoolContractCalls';

// Load Rocket Pool contract ABIs
import rocketMinipoolManagerAbi from '../../../lib/abi/rocketpool/contracts/contract/minipool/RocketMinipoolManager.json';
import rocketNodeManagerAbi from '../../../lib/abi/rocketpool/contracts/contract/node/RocketNodeManager.json';
// import minipoolContractAbi from '../local-abis/SingleMinipoolContractAbi.json'; // TO DO: figure out where to put this file and then import it when you need it:

const smartContractAddresses = {
	rocketNodeManager: '0x89F478E6Cc24f052103628f36598D4C14Da3D287',
	rocketMinipoolManager: '0x6293B8abC1F36aFB22406Be5f96D893072A8cF3a'
};

// Load the data for the client to consume
/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ params, depends }) => {
	depends('page:server');

	// Initialize a connection to the Ethereum network
	const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

	// Create the RocketNodeManager contract object
	const nodeManager = await createContract(
		smartContractAddresses.rocketNodeManager,
		rocketNodeManagerAbi,
		provider,
		false
	);

	// Create the RocketMinipoolManager contract object
	const minipoolManager = await createContract(
		smartContractAddresses.rocketMinipoolManager,
		rocketMinipoolManagerAbi,
		provider,
		false
	);

	// Get node details for a single node
	const nodeDetails = await getNodeDetails(nodeManager, params.address);
	const smoothingPoolRegistrationState = await nodeManager.getSmoothingPoolRegistrationState(
		params.address
	);

	// Get minipool data for a single node
	const minipoolCount = await getNodeMiniPoolCount(minipoolManager, params.address);
	const activeMinipoolCount = await getNodeActiveMiniPoolCount(minipoolManager, params.address);
	const finalisedMinipoolCount = await getNodeFinalisedMinipoolCount(
		minipoolManager,
		params.address
	);
	const validatingMinipoolCount = await getNodeValidatingMinipoolCount(
		minipoolManager,
		params.address
	);
	const minipoolAddresses = await getMinipoolAddresses(
		minipoolManager,
		params.address,
		minipoolCount
	);

	const networkNodeCount = await nodeManager.getNodeCount();
	console.log('networkNodeCount: ', networkNodeCount);
	// const allNodes = await nodeManager.getNodeAddresses(3200, 25);
	// console.table(allNodes);

	return {
		node: {
			// From params
			address: params.address,

			// From the MinipoolManager contract
			minipoolsTotal: minipoolCount,
			minipoolsActive: activeMinipoolCount,
			minipoolsFinalized: finalisedMinipoolCount,
			minipoolsValidating: validatingMinipoolCount,
			minipoolAddresses: minipoolAddresses
		},
		minipoools: {}
	};
};
