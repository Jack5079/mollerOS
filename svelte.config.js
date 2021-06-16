const sveltePreprocess = require('svelte-preprocess')
const nesting = require('postcss-nesting')

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [
      nesting()
    ]
  }
})

module.exports = {
  preprocess
}
