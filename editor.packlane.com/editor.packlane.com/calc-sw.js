const ETagCacheKey = '/calc-etag';

const hostname = self.location.hostname;
const subdomain = hostname.split('.')[0];
const domain = hostname.split('.').slice(1).join('.');
const isQa = subdomain.includes('qa');

let sharedCalcCacheKey = 'calc-sw-cache';
let sharedCalcUrl = `https://calc-js.${domain}/app-min.js`;

if (isQa) {
    sharedCalcUrl = `https://qa2calc-js.${domain}/app-min.js`;
    sharedCalcCacheKey = 'qa-calc-sw-cache';
}

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes(sharedCalcUrl)) {
        event.respondWith(handleCalcRequest());
    }
});
 
async function handleCalcRequest() {
    const cache = await caches.open(sharedCalcCacheKey);
    const storedEtag = await retrieveEtagFromCache(cache);
 
    const headers = {
        'Content-Type': 'application/javascript',
    };
    if (storedEtag) {
        headers['If-None-Match'] = storedEtag;
    }
 
    try {
        const response = await fetch(sharedCalcUrl, { headers });
 
        if (response.status == 200) {
            const newEtag = response.headers.get('ETag');
            if (newEtag) {
                await cache.put(ETagCacheKey, new Response(newEtag));
            }
            await cache.put(sharedCalcUrl, response.clone());
            return response;
        }
 
        if (response.status == 304) {
            const cachedResponse = await cache.match(sharedCalcUrl);
            if (cachedResponse) {
                return cachedResponse;
            }
        }
 
    } catch (error) {
        // Offline fallback
        const cachedResponse = await cache.match(sharedCalcUrl);
        if (cachedResponse) {
            return cachedResponse;
        }
 
    }
}
 
async function retrieveEtagFromCache(cache) {
    const response = await cache.match(ETagCacheKey);
    return response ? await response.text() : null;
}
 