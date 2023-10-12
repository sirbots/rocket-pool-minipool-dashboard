<script>
</script>

<header>
	<div class="logo"><a href="/">LOGO</a></div>
	<nav />
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
	:global(body) {
		background-color: #ebebeb;
		font-size: 16px;
	}
	:global(h1, h2, h3, h4, h5, h6) {
		color: #333333;
		text-align: center;
	}
	:global(p) {
		color: #333333;
		font-size: 1.2rem;
	}
	:global(a) {
		color: #f06203;
	}

	header {
		display: flex;
		flex-wrap: row;
		justify-content: center;
	}
	nav,
	.logo a {
		color: #000;
		font-size: 30px;
		text-decoration: wavy underline;
	}

	.logo {
		padding: 25px;
	}

	.container {
		padding: 150px 20%;
	}

	footer {
		display: flex;
		flex-wrap: row;
		justify-content: center;

		color: #ebebeb;
		margin-top: 150px;
	}
</style>
