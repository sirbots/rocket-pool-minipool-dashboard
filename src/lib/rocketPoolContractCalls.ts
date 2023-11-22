import { Interface, ethers } from 'ethers';

// Types
interface RocketNodeManagerContract {
	getNodeDetails(nodeAddress: string): Promise<NodeDetails>;
	getSmoothingPoolRegistrationState(nodeAddress: string): Promise<boolean>;
}

export interface MinipoolManagerContract {
	getMinipoolCountPerStatus(offset: number, limit: number): Promise<number[]>;
	getNodeActiveMinipoolCount(nodeAddress: string): Promise<number>;
	getNodeFinalisedMinipoolCount(nodeAddress: string): Promise<number>;
	getNodeMinipoolCount(nodeAddress: string): Promise<number>;
	getNodeValidatingMinipoolCount(nodeAddress: string): Promise<number>;
	getNodeMinipoolAt(nodeAddress: string, index: number): Promise<string>;
}

interface MinipoolDelegateContract {
	getNodeDepositBalance(): Promise<number>;
}
interface provider {
	provider: ethers.AbstractProvider;
}

interface NodeDetails {
	message?: string;
	balanceETH: bigint;
	balanceRPL: bigint;
	rplStake: bigint;
	effectiveRPLStake: bigint;
	minimumRPLStake: bigint;
	maximumRPLStake: bigint;
	minipoolCount: bigint;
	smoothingPoolRegistrationState: boolean;
	ethMatched: bigint;
}

class CustomError extends Error {
	shortMessage: string;

	constructor(message?: string, shortMessage: string = '') {
		super(message);
		this.shortMessage = shortMessage;
	}
}

// Create a contract object
async function createContract(
	address: Interface,
	abi: Interface,
	provider: provider,
	loggingEnabled: boolean = false
) {
	// Create a contract object
	try {
		if (loggingEnabled) console.log('Creating contract object...');
		const contract = new ethers.Contract(address, abi, provider);

		if (loggingEnabled) console.log('Contract object created:\n');
		if (loggingEnabled) console.log(contract);

		return contract;
	} catch (error) {
		console.error(error);
	}
}

/*****************************
 * RocketNodeManager.sol Calls
 *****************************/

async function getNodeDetails(
	rocketNodeManagerContract: RocketNodeManagerContract,
	nodeAddress: string
): Promise<NodeDetails | { address: string; message: string } | undefined> {
	try {
		const nodeDetails = await rocketNodeManagerContract.getNodeDetails(nodeAddress);
		return nodeDetails;
	} catch (error) {
		console.log('*** ERROR MESSAGE FROM FUNCTION ***');
		console.error(error);

		if (error instanceof CustomError && error.shortMessage == 'bad address checksum') {
			console.error(error.shortMessage);
			return {
				address: nodeAddress,
				message: 'invalid-node-address'
			};
		}
	}
}

async function getSmoothingPoolRegistrationState(
	rocketNodeManagerContract: RocketNodeManagerContract,
	nodeAddress: string
) {
	try {
		const smoothingPoolRegistrationState =
			await rocketNodeManagerContract.getSmoothingPoolRegistrationState(nodeAddress);

		return smoothingPoolRegistrationState;
	} catch (error) {
		console.error(error);
	}
}

/*********************************
 * RocketMinipoolManager.sol Calls
 *********************************/

// Get all minipool counts by minipool status
// Not used in current program, but could be used to create a network stats page.
async function getMinipoolCountPerStatus(
	minipoolManagerContract: MinipoolManagerContract,
	offset: number,
	limit: number
) {
	try {
		const minipoolCountPerStatus = await minipoolManagerContract.getMinipoolCountPerStatus(
			offset,
			limit
		);

		return minipoolCountPerStatus;
	} catch (error) {
		console.error(error);
	}
}

// Get the count of minipools associated with a Rocket Pool node address
async function getNodeMiniPoolCount(
	minipoolManagerContract: MinipoolManagerContract,
	nodeAddress: string
) {
	try {
		if (minipoolManagerContract != undefined) {
			const minipoolCount = await minipoolManagerContract.getNodeMinipoolCount(nodeAddress);
			return Number(minipoolCount);
		}
	} catch (error) {
		console.error(error);
	}
}

// Get the count of active minipools associated with a Rocket Pool node address
async function getNodeActiveMiniPoolCount(
	minipoolManagerContract: MinipoolManagerContract,
	nodeAddress: string
) {
	try {
		const activeMinipoolCount = await minipoolManagerContract.getNodeActiveMinipoolCount(
			nodeAddress
		);

		return Number(activeMinipoolCount);
	} catch (error) {
		console.error(error);
	}
}
// Get the count of finalized minipools associated with a Rocket Pool node address
async function getNodeFinalisedMinipoolCount(
	minipoolManagerContract: MinipoolManagerContract,
	nodeAddress: string
) {
	try {
		const finalisedMinipoolCount = await minipoolManagerContract.getNodeFinalisedMinipoolCount(
			nodeAddress
		);

		return Number(finalisedMinipoolCount);
	} catch (error) {
		console.error(error);
	}
}

// Get the count of staking minipools associated with a Rocket Pool node address
async function getNodeValidatingMinipoolCount(
	minipoolManagerContract: MinipoolManagerContract,
	nodeAddress: string
) {
	try {
		const stakingMinipoolCount = await minipoolManagerContract.getNodeValidatingMinipoolCount(
			nodeAddress
		);

		return Number(stakingMinipoolCount);
	} catch (error) {
		console.error(error);
	}
}

// Get a list of minipool addressess associated with a node
async function getMinipoolAddresses(
	minipoolManagerContract: MinipoolManagerContract,
	nodeAddress: string,
	minipoolCount: number
) {
	const validatingMinipools = [];

	for (let i = 0; i < minipoolCount; i++) {
		const validatingMinipool = await minipoolManagerContract.getNodeMinipoolAt(nodeAddress, i);

		validatingMinipools.push(validatingMinipool);
	}
	return validatingMinipools;
}

/*********************************
 * Minipool Delegate Contract Calls
 *********************************/

// Get the node deposit balance
async function getNodeDepositBalance(
	minipoolDelegateContract: MinipoolDelegateContract
	// nodeAddress: string
) {
	try {
		const stakingMinipoolCount = await minipoolDelegateContract.getNodeDepositBalance();

		return Number(stakingMinipoolCount);
	} catch (error) {
		console.error(error);
	}
}

export {
	createContract,
	getNodeDetails,
	getSmoothingPoolRegistrationState,
	getMinipoolCountPerStatus,
	getNodeMiniPoolCount,
	getNodeActiveMiniPoolCount,
	getNodeFinalisedMinipoolCount,
	getNodeValidatingMinipoolCount,
	getMinipoolAddresses,
	getNodeDepositBalance
};
