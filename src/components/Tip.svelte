<script lang="ts">
  import { fly } from 'svelte/transition'
  export let facts: string[] = [
    'you can press backtick twice to toggle search',
    'the DaBaby app will destroy your filesystem',
    'the terminal has git support (isogit cli)',
    'you are using mollerOS v' +
      'PKG_VERSION'
        .split('.')
        .filter((number) => number !== '0')
        .join('.')
  ]
</script>

<header transition:fly={{ y: -50, opacity: 1 }}>
  mollerOS fact: {facts[Math.floor(Math.random() * facts.length)]}
</header>

<style>
  header {
    min-height: 50px;
    padding-left: 1em;
    padding-right: 1em;
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    user-select: none;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }

  @media (max-width: 375px) {
    header {
      display: none;
    }
  }
</style>
