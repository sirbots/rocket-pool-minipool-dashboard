<script lang="ts">
	import { dev } from '$app/environment';
</script>

<svelte:head>
	<script type="text/javascript">
		!(function () {
			'use strict';
			!(function (e, t) {
				var n = e.amplitude || { _q: [], _iq: {} };
				if (n.invoked)
					e.console && console.error && console.error('Amplitude snippet has been loaded.');
				else {
					var r = function (e, t) {
							e.prototype[t] = function () {
								return (
									this._q.push({ name: t, args: Array.prototype.slice.call(arguments, 0) }), this
								);
							};
						},
						s = function (e, t, n) {
							return function (r) {
								e._q.push({ name: t, args: Array.prototype.slice.call(n, 0), resolve: r });
							};
						},
						o = function (e, t, n) {
							e[t] = function () {
								if (n)
									return { promise: new Promise(s(e, t, Array.prototype.slice.call(arguments))) };
							};
						},
						i = function (e) {
							for (var t = 0; t < m.length; t++) o(e, m[t], !1);
							for (var n = 0; n < g.length; n++) o(e, g[n], !0);
						};
					n.invoked = !0;
					var u = t.createElement('script');
					(u.type = 'text/javascript'),
						(u.integrity =
							'sha384-x0ik2D45ZDEEEpYpEuDpmj05fY91P7EOZkgdKmq4dKL/ZAVcufJ+nULFtGn0HIZE'),
						(u.crossOrigin = 'anonymous'),
						(u.async = !0),
						(u.src = 'https://cdn.amplitude.com/libs/analytics-browser-2.0.0-min.js.gz'),
						(u.onload = function () {
							e.amplitude.runQueuedFunctions ||
								console.log('[Amplitude] Error: could not load SDK');
						});
					var a = t.getElementsByTagName('script')[0];
					a.parentNode.insertBefore(u, a);
					for (
						var c = function () {
								return (this._q = []), this;
							},
							p = [
								'add',
								'append',
								'clearAll',
								'prepend',
								'set',
								'setOnce',
								'unset',
								'preInsert',
								'postInsert',
								'remove',
								'getUserProperties'
							],
							l = 0;
						l < p.length;
						l++
					)
						r(c, p[l]);
					n.Identify = c;
					for (
						var d = function () {
								return (this._q = []), this;
							},
							f = [
								'getEventProperties',
								'setProductId',
								'setQuantity',
								'setPrice',
								'setRevenue',
								'setRevenueType',
								'setEventProperties'
							],
							v = 0;
						v < f.length;
						v++
					)
						r(d, f[v]);
					n.Revenue = d;
					var m = [
							'getDeviceId',
							'setDeviceId',
							'getSessionId',
							'setSessionId',
							'getUserId',
							'setUserId',
							'setOptOut',
							'setTransport',
							'reset',
							'extendSession'
						],
						g = [
							'init',
							'add',
							'remove',
							'track',
							'logEvent',
							'identify',
							'groupIdentify',
							'setGroup',
							'revenue',
							'flush'
						];
					i(n),
						(n.createInstance = function (e) {
							return (n._iq[e] = { _q: [] }), i(n._iq[e]), n._iq[e];
						}),
						(e.amplitude = n);
				}
			})(window, document);
		})();

		if (!dev) {
			amplitude.init('9ff1fb930acca3ec495c354f6f5d9dd4', null, {
			// optional configuration options
			saveEvents: true,
			includeUtm: true,
			includeReferrer: true,
			platform: 'Web'
		}
		
		});
	</script>
</svelte:head>

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
