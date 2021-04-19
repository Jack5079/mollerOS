<script lang="ts">
  export let file: string
</script>

<img src="./fs{file}" alt={file} />

<style>
  img {
    width: 100%;
    /* height: 100%; */
    object-fit: contain;
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    img {
      background: white;
      color: black;
    }
  }
</style>
