<script lang="ts">
  import Row from './Row.svelte'
  import Nav from './Nav.svelte'
  import Menu from './Menu.svelte'
  import Loading from '../../components/Loading.svelte'
  import fs from '../../fs'

  let directory: string = '/'
  let context: HTMLMenuElement
  let contextfile = ''

  $: files = fs.promises.readdir(directory)
</script>

<div class="root">
  <Nav bind:contextfile bind:directory>
    <button on:click={() => (files = fs.promises.readdir(directory))}>↻</button>
  </Nav>
  <main on:click={() => (contextfile = '')}>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date modified</th>
          <th>Size</th>
        </tr>
      </thead>
      {#await files}
        Loading...
        <Loading />
      {:then files}
        {#each files as file}
          <Row {file} bind:directory bind:contextfile {context} />
        {:else}
          No files found!
        {/each}
      {/await}
    </table>
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

  button {
    background: none;
    padding: 0;
    color: white;
    border: 0;
    margin: 0;
  }
  button:hover,
  button:focus {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (prefers-color-scheme: light) {
    button:hover,
    button:focus {
      background: rgba(0, 0, 0, 0.3);
    }

    main {
      background: rgba(128, 128, 128, 0.1);
    }

    button {
      color: black;
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
