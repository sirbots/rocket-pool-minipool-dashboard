import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	// Check if the user is already has a nodeAddress cookie set from a previous search
	const nodeAddress = cookies.get('nodeAddress');

	return {
		nodeAddress
	};
}

/** @type {import('./$types').Actions} */
export const actions: import('./$types').Actions = {
	setAddress: async ({ cookies, request }) => {
		// Get the form data
		const data = await request.formData();
		const nodeAddress = data.get('nodeAddress') as string;

		// Set a cookie with the node address
		console.log(`Setting cookie for node address ${nodeAddress}...`);
		cookies.set('nodeAddress', nodeAddress, { path: '/' });

		// Redirect to the node page
		console.log(`Redirecting to /node/${nodeAddress}`);
		throw redirect(303, `/node/${nodeAddress}`);
	}
};
