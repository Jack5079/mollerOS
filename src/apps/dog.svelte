<!-- svelte-ignore a11y-media-has-caption -->
<script>
  let time = 0;
  let total = 1;
</script>

<main>
  <div style="height: {(time / total) * 100}%" />
  <video
    bind:duration={total}
    bind:currentTime={time}
    src="https://cdn.discordapp.com/attachments/763177139850969090/823618471769276456/the_real_dog.mp4"
    autoplay
    loop
  />
</main>

<style>
  main {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  video {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    max-width: 100%;
    max-height: 100%;
  }

  div {
    position: absolute;
    left: 0;
    top: 0;
    background: blue;
    width: 5px;
    z-index: 1;
  }
</style>
