<script lang="ts">
  import fs from '../../fs'
  export let file: string
  let url: string
  fs.promises.readFile(file).then((uint) => {
    url = URL.createObjectURL(new Blob([uint]))
  })
  let playbackrate: number = 1
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<main>
  <audio
    on:canplaythrough={() => URL.revokeObjectURL(url)}
    bind:playbackRate={playbackrate}
    src={url}
    controls
    autoplay
  />
  <label>
    speed: {playbackrate}x
    <input
      type="range"
      bind:value={playbackrate}
      min={0.25}
      max={4}
      step={0.25}
    />
  </label>
</main>

<style>
  main {
    width: 100%;
    background: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  audio {
    width: 100%;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: black;
    }
  }
</style>
