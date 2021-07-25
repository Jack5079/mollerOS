<script lang="ts">
  import Header from './Header.svelte'
  import { sessions } from '../stores'
  import type { Session, MouseEventHandler } from '../types'
  import { slide } from 'svelte/transition'
  import { draggable } from 'svelte-drag'
  export let session: Session
  export let resizable = true
  let win: HTMLDivElement
  const move_to_top: MouseEventHandler<HTMLElement> = (event) => {
    if (
      $sessions.includes(session) &&
      !(event.target as HTMLElement).matches('article > header > nav > button')
    ) {
      $sessions = [...$sessions.filter((sess) => session !== sess), session]
    }
  }
  let maximized: boolean = false
</script>

<!--
@component
The mollerOS window.

Requires a `session` (see ../types.ts)

Takes a slot which is the content of the window
-->
<article
  use:draggable={{
    handle: 'header',
    bounds: 'body',
    /*defaultPosition: {
      y: Math.random(),
      x: Math.random()
    }*/
  }}
  on:mousedown={move_to_top}
  bind:this={win}
  on:introstart={() => (win.style.pointerEvents = 'none')}
  on:introend={() => (win.style.pointerEvents = 'auto')}
  on:outrostart={() => (win.style.pointerEvents = 'none')}
  on:outroend={() => (win.style.pointerEvents = 'auto')}
  transition:slide={{ duration: 500 }}
  class:resizable
  class:maximized
>
  <Header bind:session bind:maximized />
  <div class="slot">
    <slot />
  </div>
</article>

<style>
  .resizable {
    resize: both;
  }

  article.maximized {
    resize: none;
    animation: maximize 0.2s forwards ease-out;
  }
  article:not(.maximized) {
    border-radius: 0.5em;
  }
  @keyframes maximize {
    to {
      transform: translate3d(0,0,0);
      height: 100vh;
      width: 100%;
    }
  }
  .slot > :global(*) {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 35px;
    min-height: calc(100% - 35px);
  }
  article {
    /* will-change: left,top; */
    background: white;
    display: block;
    overflow: auto;

    max-width: 100vw;
    max-height: 100vh;
    min-height: 35px;
    min-width: max-content;
    width: 500px;
    top: 0;
    left: 0;
    height: 500px;
    position: fixed;
    scrollbar-color: lightslategray darkslategray;
    box-shadow: 5px 5px 50px black;
  }
  @media (prefers-color-scheme: light) {
    article {
      scrollbar-color: rgb(255, 255, 255) rgb(139, 216, 216);
    }
  }
  @media (max-width: 375px) {
    article {
      position: static;
      height: calc(100vh - 30px);
    }
    .resizable {
      resize: none;
    }
    article:not(:first-of-type) {
      display: none;
    }
  }
</style>
