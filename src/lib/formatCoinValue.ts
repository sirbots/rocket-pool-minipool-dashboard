// Used to convert wei to eth or other assets that have 18 decimal places
export default function formatCoinValue(value: number, decimalsToShow: number) {
	const convertedNumber = value / 10 ** 18;
	const stringWithDecimals = convertedNumber.toFixed(decimalsToShow);
	const formattedValue = Number(stringWithDecimals);

	return formattedValue;
}
