/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' }
  },
  plugins: ['@snowpack/plugin-svelte', '@snowpack/plugin-typescript'],
  buildOptions: {
    metaUrlPath: 'snowpack',
    sourcemap: 'inline'
  },
  optimize: {
    bundle: false,
    minify: true,
    target: 'es2020'
  },
  devOptions: {
    port: 5000,
    open: 'none'
  }
}
