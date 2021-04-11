// @ts-nocheck
import http from 'https://unpkg.com/isomorphic-git@beta/http/web/index.js'
window.http = http
navigator.serviceWorker.register('./sw.js')
