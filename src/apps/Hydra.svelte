<script lang="ts">
  import { onMount } from "svelte";
  import apps from "../apps";
  import { nanoid, open_apps } from "../stores";
  export let session: string;
  const self = apps.find((app) => app.name === "Hydra");
  onMount(() => () => {
    $open_apps = [
      ...$open_apps,
      {
        app: self,
        id: nanoid(),
      },
      {
        app: self,
        id: nanoid(),
      },
    ];
  });
  function close() {
    $open_apps = $open_apps.filter((sess) => session !== sess.id);
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<main>
  <audio autoplay src="https://www.windows93.net/c/sys/sounds/CHORD.ogg" />
  <img src="https://windows93.net/c/sys/skins/w93/apps/hydra.png" alt="Hydra" />
  <article>
    Cut off a head, two more will take its place.<br />
    [ Hydra ViRuS BioCoded by Typhon/Echidna ]<br />
    <button on:click={close}>OK</button>
  </article>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
  }
</style>
