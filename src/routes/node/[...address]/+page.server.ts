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

		let nodeDetails;

		if (rocketNodeManagerContract != undefined) {
			nodeDetails = await getNodeDetails(rocketNodeManagerContract, params.address);
		}

		// Handle invalid node address
		if (nodeDetails) {
			if (nodeDetails.message == 'invalid-node-address') {
				return {
					nodeAddress: params.address,
					message: nodeDetails.message
				};
			} else {
				const registrationTime = nodeDetails.registrationTime;
				const registrationDate = new Date(Number(registrationTime) * 1000);
				const formattedRegistrationDate = new Intl.DateTimeFormat('en-US', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				}).format(registrationDate);

				// Return the data for Svelte to render
				return {
					nodeAddress: params.address,
					timezone: nodeDetails.timezoneLocation,
					formattedRegistrationDate: formattedRegistrationDate
				};
			}
		}
	} catch (error) {
		console.log('*** ERROR MESSAGE ***');
		console.error(error);
	}
};
