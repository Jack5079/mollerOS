<script lang="ts">
  import Row from "./Row.svelte";
  import Nav from "./Nav.svelte";
  import Menu from './Menu.svelte'
  import fs from "../../fs";

  let directory: string = "/";
  let context: HTMLMenuElement;
  let contextfile = "";
  
  $: files = fs.promises.readdir(directory);
</script>

<div class="root">
  <Nav bind:contextfile bind:directory />
  <main on:click={() => (contextfile = "")}>
    {#await files then files}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date modified</th>
            <th>Size</th>
          </tr>
        </thead>
        {#each files as file}
          <Row {file} bind:directory bind:contextfile {context} />
        {/each}
      </table>
    {/await}
  </main>
  <Menu bind:context bind:contextfile bind:files />
</div>

<style>
  thead th {
    text-align: left;
  }
  .root {
    background: black;
    color: white;
    height: calc(100% - 35px);
    width: 100%;
  }
  tr:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  table {
    width: 100%;
  }
  main {
    overflow: auto;
    height: calc(100% - 21px);
    background: rgba(100, 100, 100, 0.1);
  }
  @media (prefers-color-scheme: light) {
    main {
      background: rgba(128, 128, 128, 0.1);
    }
    .root {
      background: rgb(255, 255, 255);
      color: black;
    }

    tr:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
</style>
