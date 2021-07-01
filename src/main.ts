import mollerOS from './components/mollerOS.svelte'

document.body?.remove()
new mollerOS({
  target: document.documentElement
})

console.log(
  `🐶 mollerOS${
    location.hostname === 'localhost' || location.hostname.endsWith('gitpod.io')
      ? ' dev'
      : ''
  }`
)

export {}
