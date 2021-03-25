<script lang="ts">
  let directory = [];
  import fs from "../fs";
  import { getIconForFile, getIconForFolder } from "vscode-icons-js";
  $: files = fs.promises.readdir(
    directory.length === 0 ? "/" : directory.join("/")
  );
  async function open(file: string) {
    const stat = await fs.promises.stat(directory.join("/") + "/" + file);
    if (stat.type === "dir") {
      if (directory[0] === "") {
        directory = [...directory, file];
      } else {
        directory = ["", ...directory, file];
      }
    }
  }
  function revert_to(index: number) {
    directory = directory.filter((_, i) => i <= index);
  }
</script>

<div class="root">
  <nav>
    <button on:click={() => (directory = [])}>/</button>
    {#each directory as folder, index}
      {#if folder}
        <button on:click={() => revert_to(index)}>{folder}</button>
      {/if}
    {/each}
  </nav>
  <main>
    {#await files}
      Loading...
    {:then files}
      {#each files as file}
        <button on:click={() => open(file)}>
          {#await fs.promises.stat(directory.join("/") + "/" + file)}
            <img alt="" />
          {:then stat}
            <img
              width={25}
              height={25}
              alt={file}
              src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/{stat.type ===
              'dir'
                ? getIconForFolder(file)
                : getIconForFile(file)}"
            />
          {/await}
          <br />
          {file}
        </button>
      {/each}
    {/await}
  </main>
</div>

<style>
  .root {
    background: black;
    color: white;
    width: 100%;
  }
  button {
    margin: 0;
  }

  nav > button {
    background: none;
    padding: 0;
    color: white;
    border: 0;
  }
  button:hover,
  button:focus {
    background: rgba(255, 255, 255, 0.3);
  }
  main > button {
    background: none;
    color: white;
    border: 0;
  }
  main {
    background: rgba(100, 100, 100, 0.1);
  }
  @media (prefers-color-scheme: light) {
    main > button {
      color: black;
    }
    main {
      background: rgba(128, 128, 128, 0.1);
    }
    nav > button {
      color: black;
    }
    .root {
      background: rgb(255, 255, 255);
      color: black;
    }

    button:hover,
    button:focus {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  nav {
    display: flex;
    align-items: center;
  }
  nav > button:not(:first-child)::after {
    content: "/";
  }
</style>
