<script lang="ts">
  import Tab from './Tab.svelte'
  import { fly } from 'svelte/transition'
  import { close } from '../../util'
  export let startingdirectory = '/'
  export let session: string
  let tab = 0
  let tabs = [
    {
      messages: [],
      directory: startingdirectory,
      command: '',
      needsauth: false
    }
  ]
  $: tab > tabs.length - 1 && (tab = tabs.length - 1)
  $: tabs.length === 0 && close(session)
</script>

<main>
  <nav>
    {#each tabs as tabb, i}
      <article
        on:click={() => (tab = i)}
        class:active={i === tab}
        transition:fly={{ y: -50 }}
      >
        <input type="text" placeholder="New Tab" /><button
          on:click={() => (tabs = tabs.filter((tab) => tab !== tabb))}
          >🗙︎</button
        >
      </article>
    {/each}
    <button
      on:click={() =>
        (tabs = [
          ...tabs,
          {
            messages: [],
            directory: tabs[tab].directory,
            command: '',
            needsauth: false
          }
        ])}>+</button
    >
  </nav>
  <Tab bind:tab={tabs[tab]} />
</main>

<style lang="postcss">
  .active {
    border: solid 1px blue;
  }

  nav {
    & button {
      padding: 0;
      background: none;
      border: 0;
      padding-left: 1em;
      padding-right: 0.1em;
      color: white;
    }
    & article {
      display: flex;
      justify-content: center;
      align-items: center;
      display: inline-block;
      background: rgba(255, 255, 255, 0.3);
    }
    & input {
      width: max-content;
    }
  }

  main {
    font-family: 'Cascadia Code', 'Consolas', monospace;
    min-width: 100%;
    background: black;
    color: white;

    input {
      padding: 0;
      margin: 0;
      font-size: 13px;
      background: transparent;
      color: white;
      border: 0;
      font-family: 'Cascadia Code', 'Consolas', monospace;
    }

    & > form input {
      width: 100%;
    }
  }
  @media (prefers-color-scheme: light) {
    main,
    main input {
      color: black;
    }
    main {
      background: white;
    }
    nav button {
      color: black;
    }
    nav article {
      display: inline-block;
      background: rgba(0, 0, 0, 0.1);
    }
  }
</style>
