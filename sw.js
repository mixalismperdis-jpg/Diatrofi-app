const C="diatrofi-v28";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);if(e.request.method!=="GET")return;
  if(u.origin===location.origin){ // εφαρμογή: πρώτα δίκτυο (παρακάμπτει την cache 10 λεπτών του GitHub Pages), αλλιώς αποθηκευμένη
    e.respondWith(fetch(e.request.url,{cache:"no-cache"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));return}
  if(u.hostname==="cdn.jsdelivr.net"){ // βιβλιοθήκη barcode: μία φορά από το δίκτυο, μετά από την αποθήκη
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const cp=n.clone();caches.open(C).then(c=>c.put(e.request,cp));return n})))}
});
