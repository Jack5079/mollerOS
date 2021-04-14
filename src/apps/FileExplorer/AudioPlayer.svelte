<script lang="ts">
  import fs from '../../fs'
  export let file: string
  let url: string
  fs.promises.readFile(file).then((uint) => {
    url = URL.createObjectURL(new Blob([uint]))
  })
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<main>
<audio src={url} controls autoplay />
</main>
<style>
  main {
    width: 100%;
    background: black;
    color: white;
    display:flex;
    justify-content:center;
    align-items:center;
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
