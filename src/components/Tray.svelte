<script lang="ts">
  let time = new Date().toLocaleString()
  import { onMount } from 'svelte'
  onMount(() => {
    const id = setInterval(() => {
      time = new Date().toLocaleString()
    }, 1000)
    return () => clearInterval(id)
  })
</script>

<nav>
  <span>{time}</span>
</nav>

<style>
  nav {
    padding-right: 1em;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    color: white;
  }
</style>
