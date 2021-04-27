/// <reference lib="WebWorker" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
// @ts-ignore
const worker = self
//console.log(worker)
/**
 * @param {FetchEvent} event
 */
async function onfetch(event) {
  const path = event.request.url.replace(location.href.replace('sw.js', ''), '')
  if (path.startsWith('fs/')) {
    try {
      /** @type {import('@jkearl/lightning-fs').default} */
      // @ts-ignore
      const fs = (await import('https://cdn.skypack.dev/@jkearl/lightning-fs'))
        .default

      const uint8 = await fs.promises.readFile(path.replace('fs', ''))
      return new Response(uint8, {
        status: 200
      })
    } catch {
      return new Response('404 - not found', {
        status: 404,
        statusText: 'Not Found'
      })
    }
  } else return fetch(event.request)
}
worker.addEventListener('fetch', (e) => e.respondWith(onfetch(e)))
