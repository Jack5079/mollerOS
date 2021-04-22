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
  <small>mollerOS v{'PKG_VERSION'}</small>
</nav>

<style>
  nav {
    line-height: 35px;
    padding-right: 1em;
    height: 100%;
    text-align: right;
    float: right;
    color: white;
    gap: 5px;
  }
</style>
