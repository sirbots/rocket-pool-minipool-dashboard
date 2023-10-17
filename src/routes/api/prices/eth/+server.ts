import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getCurrentCoinPrice } from '$lib/getCurrentCoinPrice';

export async function GET({ setHeaders }) {
	const currentEthPrice = await getCurrentCoinPrice(env.COINMARKETCAP_API_KEY, 'ETH');

	setHeaders({
		'cache-control': 'max-age=30'
	});

	return json(currentEthPrice);
}
