<script>
  import { author, wallpaper } from '../stores'
  import { slide } from 'svelte/transition'
  let showsave = false
  function savenotif() {
    showsave = true
    setTimeout(() => (showsave = false), 1000)
  }
  $: {
    localStorage.setItem('wallpaper', $wallpaper)
    localStorage.setItem('gitauthor', JSON.stringify($author))
    savenotif()
  }
</script>

<main>
  <header>
    <img src="https://5079.ml/5079mlicon.svg" alt="mollerOS icon" />
    <h1>mollerOS settings</h1>
  </header>
  <label>
    Wallpaper
    <select bind:value={$wallpaper}>
      <option>bliss</option>
      <option>upleft</option>
      <option>gradient</option>
      <option value="mollersuite">mollersuite (WARNING: THIS IS 8K)</option>
    </select>
  </label>
  <label>
    Git author
    <input type="text" bind:value={$author.name} />
  </label>
  <label>
    Git email
    <input type="email" bind:value={$author.email} />
  </label>
  {#if showsave}
    <strong transition:slide> Changes saved. </strong>
  {/if}
</main>

<style>
  strong {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: green;
    color: white;
    text-align: center;
  }
  header {
    text-align: center;
  }
  main {
    width: 100%;
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: black;
    }
  }
</style>
