/// <reference lib="WebWorker" />

importScripts(
  'https://unpkg.com/@isomorphic-git/lightning-fs@4.4.1/dist/lightning-fs.min.js'
)

/** @type {import('@jkearl/lightning-fs').default} */
// @ts-ignore
const fs = new LightningFS(localStorage.getItem('drive') || 'mollerOS')

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
