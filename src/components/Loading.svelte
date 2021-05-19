<div aria-label="Loading..." />

<style>
  div {
    --duration: 0.75s;
    --size: 60px;
    --color: #ff3e00;
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
