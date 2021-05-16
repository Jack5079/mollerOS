import mollerOS from './components/mollerOS.svelte'
document.body?.remove()
new mollerOS({
  target: document.documentElement,
  intro: true
})

if (
  location.hostname !== 'localhost' &&
  !location.hostname.endsWith('gitpod.io')
)
  new Audio('https://5079.ml/Windows%207%20Startup.mp3').play()
console.log(
  `🐶 mollerOS${
    location.hostname === 'localhost' || location.hostname.endsWith('gitpod.io')
      ? ' dev'
      : ''
  }`
)

export {}
