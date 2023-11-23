export interface MinipoolApiData {
	status: string;
	minipoolCount: number;
	activeMinipoolCount: number;
	validatingMinipoolCount: number;
	finalisedMinipoolCount: number;
	minipoolAddresses: string[];
}

export interface Minipool {
	address: string;
	nodeDepositBalance: number;
	minipoolCommissionRate: number;
	balance: number;
	nodeShare: number;
	userShare: number;
	nodeRefundBalance: number;
}

export interface MinipoolBalance {
	totalUnclaimed: number;
	nodeUnclaimed: number;
}

export interface NodeApiData {
	status: string;
	balanceETH: number;
	balanceRPL: number;
	rplStake: number;
	effectiveRPLStake: number;
	minimumRPLStake: number;
	maximumRPLStake: number;
	minipoolCount: number;
	ethMatched: number;
	smoothingPoolRegistrationState: boolean;
}

export interface Umami {
	track: (event: string) => void;
}
