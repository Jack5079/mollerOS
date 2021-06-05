<script lang="ts">
  import Header from './Header.svelte'
  import { minimized, open_apps } from '../stores'
  import type { Session, MouseEventHandler } from '../types'
  import { slide } from 'svelte/transition'
  export let session: Session
  export let x = Math.random() * (window.innerWidth - 500)
  export let y = Math.random() * (window.innerHeight - 500)
  export let resizable = true
  export let maximized = false
  let win: HTMLDivElement
  $: {
    if (win) {
      win.style.left = x + 'px'
      win.style.top = y + 'px'
    }
  }
  function dragstart() {
    const move = (ev: MouseEvent) => {
      const { x: sizex, y: sizey } = win.getBoundingClientRect()
      x = sizex + ev.movementX
      y = sizey + ev.movementY
    }
    document.addEventListener('mousemove', move)
    window.addEventListener(
      'mouseup',
      () => {
        document.removeEventListener('mousemove', move)
      },
      {
        once: true
      }
    )
  }
  const move_to_top: MouseEventHandler<HTMLElement> = (event) => {
    if (
      $open_apps.includes(session) &&
      !(event.target as HTMLElement).matches('article > header > nav > button')
    ) {
      $open_apps = [...$open_apps.filter((sess) => session !== sess), session]
    }
  }
</script>

<!--
@component
The mollerOS window.

Requires a `session` (see ../types.ts)

Takes a slot which is the content of the window
-->
<article
  on:mousedown={move_to_top}
  bind:this={win}
  on:introstart={() => (win.style.pointerEvents = 'none')}
  on:introend={() => (win.style.pointerEvents = 'auto')}
  on:outrostart={() => (win.style.pointerEvents = 'none')}
  on:outroend={() => (win.style.pointerEvents = 'auto')}
  transition:slide={{ duration: 500 }}
  class:hidden={$minimized.has(session.id)}
  class:resizable
  class:maximized
>
  <Header
    on:mousedown={dragstart}
    {session}
    bind:maximized
    on:keydown={(event) => {
      if (event.key === 'ArrowUp') {
        y -= 1
      } else if (event.key == 'ArrowDown') {
        y += 1
      } else if (event.key == 'ArrowRight') {
        x += 1
      } else if (event.key == 'ArrowLeft') {
        x -= 1
      }
    }}
  />
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
      top: 0;
      left: 0;
      height: 100vh;
      width: 100%;
    }
  }
  .hidden {
    display: none;
  }
  :global(.slot > *) {
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
    height: 500px;

    scrollbar-color: lightslategray darkslategray;

    position: fixed;
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
