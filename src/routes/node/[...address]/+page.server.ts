import type { PageServerLoad } from './$types';

import { ethers } from 'ethers';
import { env } from '$env/dynamic/private';
// Helper functions
import { createContract, getNodeDetails } from '$lib/rocketPoolContractCalls';

// Load Rocket Pool contract ABIs
import rocketNodeManagerAbi from '$lib/abi/rocketpool/contracts/contract/node/RocketNodeManager.json';

// Load the data for the client to consume
/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ params }) => {
	try {
		// Initialize a connection to the Ethereum network
		const provider = ethers.getDefaultProvider('mainnet', { etherscan: env.ETHERSCAN_API_KEY });

		const rocketNodeManagerContract = await createContract(
			'0x89F478E6Cc24f052103628f36598D4C14Da3D287',
			rocketNodeManagerAbi,
			provider,
			false
		);

		const nodeDetails = await getNodeDetails(rocketNodeManagerContract, params.address);

		const registrationTime = nodeDetails.registrationTime;

		const registrationDate = new Date(Number(registrationTime) * 1000);
		const formattedRegistrationDate = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(registrationDate);

		return {
			serverData: {
				// From params
				address: params.address,
				timezone: nodeDetails.timezoneLocation,
				formattedRegistrationDate: formattedRegistrationDate
			}
		};
	} catch (error) {
		console.error(error);
	}
};
