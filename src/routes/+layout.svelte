<script lang="ts">
</script>

<header>
	<div class="logo"><a href="/">Rocket Dash</a></div>
</header>

<div class="container">
	<!-- The page data goes in the slot -->
	<slot />
	<!-- /the page data goes in the slot -->
</div>

<footer>
	<div class="builtBy">
		<p>Built by <a href="/">my name</a>.</p>
	</div>
</footer>

<style>
	/* Set global styles */
	:root {
		--white: #f5f3f3;
		--cream: #cccccc;
		--black: #101010;
		--light-orange: #ff9757;
		--dark-orange: #f06203;
		--red: #da3434;

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
		flex-wrap: row;
		justify-content: center;
		padding: 80px 25px 25px 25px;
	}
	.logo {
		padding: 14px 45px;
		border-radius: var(--standard-radius);
		border: 3px double #101010;
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
	:global(.centered) {
		text-align: center;
	}

	/* Footer */
	footer {
		display: flex;
		flex-wrap: row;
		justify-content: center;

		color: var(--white);
		margin-top: 150px;
	}
</style>
