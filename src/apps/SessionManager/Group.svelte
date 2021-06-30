<script lang="ts">
  import type { App } from '../../types'
  import { slide, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import { sessions } from '../../stores'
  export let sessionids: string[]
  export let app: App
</script>

<optgroup
  on:click|self={() => {
    sessionids = [
      ...new Set([
        ...sessionids,
        ...$sessions
          .filter((session) => session.app === app)
          .map((session) => session.id)
      ])
    ]
  }}
  transition:fly={{ x: -10, duration: 300 }}
  label={app.name}
  style="background-image: url({JSON.stringify(
    app.icon
  )}); background-repeat: no-repeat; background-position: top right; background-size: 25px 25px;"
>
  {#each $sessions.filter((session) => session.app === app) as session (session.id)}
    <option
      animate:flip={{ duration: 300 }}
      transition:fly={{ x: -10, duration: 300 }}
      value={session.id}>Session {session.id}</option
    >
  {/each}
</optgroup>
