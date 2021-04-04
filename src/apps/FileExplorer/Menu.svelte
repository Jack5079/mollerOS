<script lang="ts">
  export let contextfile: string = "";
  export let files: Promise<string[]> = Promise.resolve([]);
  import fs from "../../fs";
  export let context: HTMLMenuElement;
</script>

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

<style>
  .hidden {
    display: none;
  }

  menu {
    position: fixed;
    width: 200px;
    padding: 0;
    color: white;
    background: rgb(50, 50, 50);
  }

  menu > button {
    width: 100%;
  }
  button {
    margin: 0;
  }
  @media (prefers-color-scheme: light) {
    menu > button {
      color: black;
    }
    menu {
      background: rgb(200, 200, 200);
      color: black;
    }
  }
</style>
