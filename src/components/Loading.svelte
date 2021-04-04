<script lang="ts">
  export let size: number = 60;
  export let color = "#FF3E00";
  export let unit: string = "px";
  export let duration: `${number}${'s' | 'ms'}` | '0' = "0.75s";
</script>
<style>
  .circle {
    display: inline-block;
    height: var(--size);
    width: var(--size);
    border-color: var(--color) transparent var(--color) var(--color);
    border-width: calc(var(--size) / 15);
    border-style: solid;
    border-image: initial;
    border-radius: 50%;
    animation: var(--duration) linear 0s infinite normal none running rotate;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
<div class="circle" style="--size: {size}{unit}; --color: {color}; --duration: {duration}"></div>
