<script lang="ts">
  import { version } from '../constants'
</script>

<main>
  <header>
    <img src="icon.svg" alt="mollerOS icon" />
    <h1>mollerOS {version} changelog</h1>
  </header>
  <li>New logo</li>
</main>

<style>
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
  img {
    width: min(100%, 200px);
  }
</style>
