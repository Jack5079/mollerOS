<script lang="ts">
  import fs from '../../fs'
  export let file: string
  let url: string
  fs.promises.readFile(file).then((uint) => {
    url = URL.createObjectURL(new Blob([uint]))
  })
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<video src={url} controls autoplay />

<style>
  video {
    width: 100%;
    background: black;
    color: white;
    object-fit: scale-down;
  }
  @media (prefers-color-scheme: light) {
    video {
      background: white;
      color: black;
    }
  }
</style>
