<script lang="ts">
  import { minimized, open_apps } from "../stores";
  import {close} from '../util'
  import type { Session, MouseEventHandler } from "../types";
  import { slide } from "svelte/transition";
  export let session: Session;
  export let x = Math.random() * (window.innerWidth - 500);
  export let y = Math.random() * (window.innerHeight - 500);
  export let resizable = true;
  let win: HTMLDivElement;
  $: {
    if (win) {
      win.style.left = x + "px";
      win.style.top = y + "px";
    }
  }
  function dragstart() {
    const move = (ev: MouseEvent) => {
      const { x: sizex, y: sizey } = win.getBoundingClientRect();
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
  const move_to_top: MouseEventHandler<HTMLElement> = (event) => {
    if (
      $open_apps.includes(session) &&
      !(event.target as HTMLElement).matches("article > header > nav > button")
    ) {
      $open_apps = [...$open_apps.filter((sess) => session !== sess), session];
    }
  };
  function minimize() {
    $minimized = $minimized.add(session.id);
  }
</script>

<article
  on:mousedown={move_to_top}
  bind:this={win}
  on:introstart={() => (win.style.pointerEvents = "none")}
  on:introend={() => (win.style.pointerEvents = "auto")}
  on:outrostart={() => (win.style.pointerEvents = "none")}
  on:outroend={() => (win.style.pointerEvents = "auto")}
  transition:slide={{ duration: 500 }}
  class:hidden={$minimized.has(session.id)}
  class:resizable
>
  <header on:mousedown|self={dragstart}>
    <div>
      <img
        on:dblclick={() => close(session.id)}
        src={session.app.icon}
        height="20"
        alt={session.app.name}
      />{session.app.name}
    </div>
    <nav>
      <button class="min" on:click={minimize}>_</button>
      <button class="close" on:click={() => close(session.id)}>✖</button>
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

    max-width: 100vw;
    max-height: 100vh;
    min-height: 35px;
    min-width: max-content;
    width: 500px;
    height: 500px;

    scrollbar-color: lightslategray darkslategray;

    position: fixed;
    box-shadow: 5px 5px 50px black;
  }
  header div {
    pointer-events: none;
    height: 35px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  header div img {
    pointer-events: all;
  }
  header {
    position: sticky;
    top: 0;
    user-select: none;
    z-index: 10;
    width: 100%;
    height: 35px;
    color: white;
    background: darkslategray;
  }
  @media (prefers-color-scheme: light) {
    nav button {
      color: black;
    }
    nav button:focus,
    nav button:hover {
      color: white;
    }

    article {
      scrollbar-color: rgb(255, 255, 255) rgb(139, 216, 216);
    }
    header {
      color: black;
      background: rgb(139, 216, 216);
    }
  }
  @media (max-width: 375px) {
    article {
      position: static;
      height: calc(100vh - 40px);
    }
    .resizable {
      resize: none;
    }
    .close {
      pointer-events: all;
    }
    header {
      pointer-events: none;
      background: none;
      position: absolute;
      top: 0;
    }
    .min,
    article:not(:first-of-type) {
      display: none;
    }
  }
</style>
