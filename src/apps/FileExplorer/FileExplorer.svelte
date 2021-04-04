<script lang="ts">
  import fs from "../../fs";
  import Row from "./Row.svelte";
  import Nav from "./Nav.svelte";
  let directory: string = "/";
  let context: HTMLMenuElement;
  let contextfile = "";

  $: files = fs.promises.readdir(directory);
</script>

<div class="root">
  <Nav bind:contextfile bind:directory />
  <main on:click={() => (contextfile = "")}>
    {#await files}
      Loading...
    {:then files}
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
  <menu
    class:hidden={!contextfile}
    bind:this={context}
    on:blur={() => (contextfile = "")}
    on:contextmenu|preventDefault
  >
    <button
      on:click={async () => {
        await fs.promises.unlink(contextfile);
        files = Promise.resolve(
          (await files).filter((file) => file !== contextfile.split("/").pop())
        );
        contextfile = "";
      }}>Delete</button
    >
  </menu>
</div>

<style>
  thead th {
    text-align: left;
  }
  .hidden {
    display: none;
  }
  menu {
    width: 200px;
    padding: 0;
    color: white;
    background: rgb(50, 50, 50);
  }
  .root {
    background: black;
    color: white;
    height: calc(100% - 35px);
    width: 100%;
  }
  button {
    margin: 0;
  }
  tr:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  table {
    width: 100%;
  }

  menu > button {
    width: 100%;
  }
  main {
    overflow: auto;
    height: calc(100% - 21px);
    background: rgba(100, 100, 100, 0.1);
  }
  @media (prefers-color-scheme: light) {
    menu > button {
      color: black;
    }
    menu {
      background: rgb(200, 200, 200);
      color: black;
    }
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
  menu {
    position: fixed;
  }
</style>
