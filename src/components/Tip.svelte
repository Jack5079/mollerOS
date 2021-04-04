<script lang="ts">
  import { fly } from "svelte/transition";
  export let facts: string[] = [
    "you can press backtick twice to toggle search",
    "the DaBaby app will destroy your filesystem",
    "you can stop the hydra virus by opening session manager and closing all sessions (click the first session and then shift click the last session)",
    "5de probably won't return soon",
    "the terminal has git support (isogit cli)",
  ];
</script>

<header transition:fly={{ y: -50, opacity: 1 }}>
  mollerOS fact: {facts[Math.floor(Math.random() * facts.length)]}
</header>

<style>
  header {
    width: 100%;
    height: 50px;
    user-select: none;
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
