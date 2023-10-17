<script lang="ts">
</script>

<header>
	<div class="logo"><a href="/" data-umami-event="click_header_logo">Rocket Dash</a></div>
</header>

<div class="container">
	<!-- The page data goes in the slot -->
	<slot />
	<!-- /the page data goes in the slot -->
</div>

<footer>
	<div class="builtBy">
		<p>
			Built by @sirbots.eth (<a
				href="https://twitter.com/fun_and_profit"
				data-umami-event="click_Twitter_profile">Twitter</a
			>
			|
			<a href="https://warpcast.com/sirbots" data-umami-event="click_Warpcast_profile">Warpcast</a>)
		</p>
	</div>
</footer>

<style>
	/* Set global styles */
	:root {
		--white: #fffcf0;
		--cream: #e6e4d9;
		--black: #100f0f;
		--light-orange: #da702c;
		--dark-orange: #bc5215;
		--red: #d14d41;
		--blue: #4385be;

		--standard-radius: 15px;
	}

	@font-face {
		font-family: 'Noto Sans Mono';
		font-style: normal;
		font-weight: 400;
		src: local('Noto Sans Mono'), local('NotoSansMono-Regular'), local('NotoSansMono-Bold'),
			url('/fonts/noto-sans-mono/NotoSansMono-Regular.ttf'),
			url('/fonts/noto-sans-mono/NotoSansMono-Bold.ttf') format('truetype');
	}

	:global(body) {
		background-color: var(--white);
		font-size: 16px;
		font-family: 'Noto Sans Mono', monospace;
	}
	:global(h1, h2, h3, h4, h5, h6) {
		color: var(--black);
		text-align: center;
		font-weight: bold;
		font-family: 'Noto Sans Mono Bold', monospace;
	}
	:global(h1) {
		font-size: 2.1rem;
	}
	:global(h2) {
		font-size: 1.7rem;
	}
	:global(h3) {
		font-size: 1.5rem;
	}
	:global(h4) {
		/* Same size and weight as p, but centerd by default */
		font-weight: normal;
		font-size: 1.2rem;
	}
	:global(p) {
		color: var(--black);
		font-size: 1.1rem;
		font-weight: 400;
		line-height: 1.8;
	}
	:global(a) {
		color: var(--dark-orange);
		text-decoration: dotted underline;
	}

	/* Header */
	header {
		display: flex;
		flex-direction: column;
		flex-wrap: row;
		justify-content: center;
		align-items: center;
		padding: 100px 25px 25px 25px;
	}
	.logo {
		padding: 14px 45px;
		border-radius: var(--standard-radius);
		border: 3px double #101010;
		max-width: 200px;
		margin-bottom: 20px;
	}

	.logo a {
		color: #000;
		font-size: 1.8rem;
		text-decoration: none;
	}

	/* Page */
	.container {
		padding: 125px 15%;
	}
	:global(.highlight) {
		background-color: var(--light-orange);
		padding: 4px 9px;
		font-weight: bold;
	}
	:global(.highlight-blue) {
		background-color: var(--blue);
		padding: 4px 9px;
		font-weight: bold;
	}
	:global(.centered) {
		text-align: center;
	}

	/* Footer */
	footer {
		display: flex;
		flex-wrap: row;
		justify-content: center;

		color: var(--white);
		margin-top: 100px;
		padding-bottom: 100px;
	}
</style>
