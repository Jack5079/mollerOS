<script lang="ts">
  export let file: string
  import fs from '../../fs'
  let value: string
  fs.promises
    .readFile(file, {
      encoding: 'utf8'
    })
    .then((text) => {
      value = (text as unknown) as string
    })
  $: fs.promises.writeFile(file, value)
</script>

<textarea bind:value />

<style>
  textarea {
    width: 100%;
    resize: none;
    border: 0;
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    textarea {
      background: white;
      color: black;
    }
  }
</style>
