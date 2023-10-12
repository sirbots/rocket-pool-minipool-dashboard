// Get the USD value of ETH
async function getCurrentCoinPrice(
	apiKey: string,
	coinSymbol: string,
	loggingEnabled: boolean = false
) {
	try {
		const priceResponse = await fetch(
			`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${coinSymbol}`,
			{
				headers: {
					'X-CMC_PRO_API_KEY': apiKey
				}
			}
		).then((priceResponse) => priceResponse.json());

		const price = priceResponse.data[coinSymbol][0].quote['USD'].price;

		if (loggingEnabled) console.log(price);
		return price;
	} catch (error) {
		console.error(error);
	}
}

export { getCurrentCoinPrice };
