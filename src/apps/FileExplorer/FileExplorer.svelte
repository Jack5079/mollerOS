<script lang="ts">
  let directory: string = "/";
  import fs from "../../fs";
  import { getIconForFile, getIconForFolder } from "vscode-icons-js";
  let context: HTMLMenuElement;
  let contextfile = "";
  $: files = fs.promises.readdir(directory);
  async function open(file: string) {
    const stat = await fs.promises.stat(directory + "/" + file);
    if (stat.type === "dir") {
      directory = `${directory}/${file}/`;
    }
  }
  function revert_to(index: number) {
    directory = directory
      .split("/")
      .filter((_, i) => i <= index)
      .join("/");
  }
  async function menu(file: string, event: MouseEvent) {
    const stat = await fs.promises.stat(directory + file + "/");
    if (stat.type === "file") {
      contextfile = directory + file;
      context.hidden = false;
      context.style.left = event.clientX + "px";
      context.style.top = event.clientY + "px";
    }
  }
  function fileSize(bytes: number): string {
    var exp = (Math.log(bytes) / Math.log(1024)) | 0;
    var result = (bytes / Math.pow(1024, exp)).toFixed(2);

    return result + " " + (exp == 0 ? "bytes" : "KMGTPEZY"[exp - 1] + "B");
  }
  //const refresh = () => (directory = directory);
</script>

<div class="root">
  <nav on:click={() => (contextfile = "")}>
    <button on:click={() => (directory = "/")}>/</button>
    {#each directory.split("/") as folder, index}
      {#if folder}
        <button on:click={() => revert_to(index)}>{folder}</button>
      {/if}
    {/each}
  </nav>
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
          <tr
            on:click={() => open(file)}
            on:contextmenu|preventDefault={(event) => menu(file, event)}
          >
            {#await fs.promises.stat(directory + "/" + file)}
              <td>{file}</td>
            {:then stat}
              <td>
                <img
                  width="23"
                  height="23"
                  alt={file}
                  src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/{stat.type ===
                  'dir'
                    ? getIconForFolder(file)
                    : getIconForFile(file)}"
                />{file}</td
              >
              <td>
                {new Date(stat.mtimeMs).toLocaleString()}
              </td>
              {#if stat.type !== "dir"}
                <td>
                  {fileSize(stat.size)}
                </td>
              {/if}
            {/await}
          </tr>
        {/each}
      </table>
    {/await}
  </main>
  <menu
    class:hidden={!contextfile}
    bind:this={context}
    on:blur={() => (contextfile = "")}
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
  nav > button {
    background: none;
    padding: 0;
    color: white;
    border: 0;
  }
  button:not(menu > button):hover,
  button:not(menu > button):focus {
    background: rgba(255, 255, 255, 0.3);
  }
  tr:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  td:first-child {
    user-select: none;
  }
  table {
    width: 100%;
  }
  main table > tr > td,
  menu > button {
    background: none;
    color: white;
    border: 0;
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
    main div table > tr > td,
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
    nav > button {
      color: black;
    }
    .root {
      background: rgb(255, 255, 255);
      color: black;
    }

    button:not(menu > button):hover,
    button:not(menu > button):focus {
      background: rgba(0, 0, 0, 0.3);
    }
    tr:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  nav {
    overflow-x: auto;
    display: flex;
    align-items: center;
  }
  nav > button:not(:first-child)::after {
    content: "/";
  }
  menu {
    position: fixed;
  }
</style>
