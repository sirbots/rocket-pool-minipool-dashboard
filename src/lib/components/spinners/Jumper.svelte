<script lang="ts">
	import type { SpinnerTypes } from './spinner.type';
	import { range, durationUnitRegex } from './utils';
	export let color: SpinnerTypes['color'] = '#FF3E00';
	export let unit: SpinnerTypes['unit'] = 'px';
	export let duration: SpinnerTypes['duration'] = '1s';
	export let size: SpinnerTypes['size'] = '60';
	export let pause: SpinnerTypes['pause'] = false;
	let durationUnit: string = duration.match(durationUnitRegex)?.[0] ?? 's';
	let durationNum: string = duration.replace(durationUnitRegex, '');
</script>

<span class="wrapper" style="--size: {size}{unit}; --color: {color}; --duration: {duration};">
	{#each range(3, 1) as version}
		<span
			class="circle"
			class:pause-animation={pause}
			style="animation-delay: {(+durationNum / 3) * (version - 1) + durationUnit};"
		/>
	{/each}
</span>

<style>
	.wrapper {
		width: var(--size);
		height: var(--size);
		display: inline-flex;
	}
	.circle {
		border-radius: 100%;
		animation-fill-mode: both;
		position: absolute;
		opacity: 0;
		width: var(--size);
		height: var(--size);
		background-color: var(--color);
		animation: bounce var(--duration) linear infinite;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes bounce {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		5% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			transform: scale(1);
		}
	}
</style>
