import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getCurrentCoinPrice } from '../../../../lib/getCurrentCoinPrice';

export async function GET() {
	const currentEthPrice = await getCurrentCoinPrice(env.COINMARKETCAP_API_KEY, 'ETH');

	return json(currentEthPrice);
}
