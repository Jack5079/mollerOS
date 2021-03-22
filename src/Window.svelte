<script lang="ts">
  import { minimized, open_apps } from "./stores";
  import type { Session } from "./types";
  import { slide } from "svelte/transition";
  export let session: Session;
  export let x = Math.random() * (window.innerWidth - 500);
  export let y = Math.random() * window.innerHeight;
  export let resizable = true;
  let win: HTMLDivElement;
  let navbar: HTMLDivElement;
  $: {
    if (win) {
      win.style.left = x + "px";
      win.style.top = y + "px";
    }
  }
  function dragstart(event: Event) {
    if (event.target === navbar) {
      const move = (ev: MouseEvent) => {
        const {
          x: sizex,
          y: sizey,
        } = navbar.parentElement.getBoundingClientRect();
        x = sizex + ev.movementX;
        y = sizey + ev.movementY;
      };
      document.addEventListener("mousemove", move);
      window.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", move);
        },
        {
          once: true,
        }
      );
    }
  }
  function close() {
    $open_apps = $open_apps.filter((sess) => session !== sess);
  }
  function minimize() {
    $minimized = $minimized.add(session.id);
  }
</script>

<article
  bind:this={win}
  transition:slide={{ duration: 500 }}
  class:hidden={$minimized.has(session.id)}
  class:resizable
>
  <header on:mousedown={dragstart} bind:this={navbar}>
    <div>
      <img src={session.app.icon} height="20" alt={session.app.name} />{session
        .app.name}
    </div>
    <nav>
      <button on:click={minimize}>_</button>
      <button on:click={close}>✖</button>
    </nav>
  </header>
  <div class="slot">
    <slot />
  </div>
</article>

<style>
  .resizable {
    resize: both;
  }
  .hidden {
    display: none;
  }
  nav {
    float: right;
  }
  nav button {
    background: transparent;
    color: white;
    display: inline-block;
    border-radius: 0;
    border: 0;
  }
  nav button:focus,
  nav button:hover {
    background: #e81123;
  }

  :global(.slot > *) {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 35px;
    min-height: calc(100% - 35px);
  }
  article {
    background: white;
    display: block;
    overflow: auto;
    width: 500px;
    max-width: 100vw;
    max-height: 100vh;
    scrollbar-width: thin;
    scrollbar-color: lightslategray darkslategray;
    height: 500px;
    min-width: max-content;
    min-height: 35px;
    position: fixed;
    box-shadow: 5px 5px 50px black;
  }
  header div {
    height: 35px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  header {
    position: sticky;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 35px;
    color: white;
    background: darkslategray;
  }
</style>
