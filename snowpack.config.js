/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: ['@snowpack/plugin-svelte', '@snowpack/plugin-typescript'],
  buildOptions: {
    metaUrlPath: 'snowpack'
  },
  devOptions: {
    port: 5000
  }
}
