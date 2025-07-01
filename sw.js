/**
 * TooGood Service Worker
 * 
 * Service Worker pour PWA avec stratégies de cache intelligentes
 * Gère la mise en cache, les mises à jour et le mode hors ligne
 * 
 * @version 1.0.0
 */

const CACHE_NAME = 'toogood-v1.0.0';
const CACHE_STATIC_NAME = 'toogood-static-v1.0.0';
const CACHE_DYNAMIC_NAME = 'toogood-dynamic-v1.0.0';

// Fichiers à mettre en cache lors de l'installation
const STATIC_FILES = [
    '/',
    '/index.html',
    '/src/html/reservation.html',
    '/src/css/reservation.css',
    '/src/js/config.js',
    '/manifest.json',
    '/assets/logo/starbucks-logo.png',
    '/assets/logo/les-halles-du-lavandiers.jpeg',
    '/assets/tgtg.webp'
];

// Fichiers critiques qui doivent toujours être disponibles
const CRITICAL_FILES = [
    '/index.html',
    '/src/html/reservation.html',
    '/src/js/config.js'
];

/**
 * Installation du Service Worker
 * Met en cache les fichiers statiques essentiels
 */
self.addEventListener('install', event => {
    console.log('[SW] Installation en cours...');
    
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                console.log('[SW] Mise en cache des fichiers statiques');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('[SW] Installation terminée');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('[SW] Erreur lors de l\'installation:', error);
            })
    );
});

/**
 * Activation du Service Worker
 * Nettoie les anciens caches
 */
self.addEventListener('activate', event => {
    console.log('[SW] Activation en cours...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => 
                            cacheName.startsWith('toogood-') && 
                            cacheName !== CACHE_STATIC_NAME &&
                            cacheName !== CACHE_DYNAMIC_NAME
                        )
                        .map(cacheName => {
                            console.log('[SW] Suppression du cache obsolète:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Activation terminée');
                return self.clients.claim();
            })
    );
});

/**
 * Interception des requêtes réseau
 * Stratégie Cache First pour les ressources statiques
 * Network First pour les données dynamiques
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorer les requêtes non-HTTP
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Stratégie pour les fichiers HTML
    if (request.headers.get('accept').includes('text/html')) {
        event.respondWith(handleHTMLRequest(request));
        return;
    }
    
    // Stratégie pour les ressources statiques (CSS, JS, images)
    if (isStaticResource(request)) {
        event.respondWith(handleStaticRequest(request));
        return;
    }
    
    // Stratégie par défaut : Network First
    event.respondWith(handleDynamicRequest(request));
});

/**
 * Gestion des requêtes HTML
 * Network First avec fallback sur cache
 */
async function handleHTMLRequest(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_DYNAMIC_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log('[SW] Réseau indisponible, utilisation du cache pour:', request.url);
        const cachedResponse = await caches.match(request);
        return cachedResponse || caches.match('/index.html');
    }
}

/**
 * Gestion des ressources statiques
 * Cache First avec mise à jour en arrière-plan
 */
async function handleStaticRequest(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        // Retourner le cache immédiatement
        updateCacheInBackground(request);
        return cachedResponse;
    }
    
    // Si pas en cache, fetch depuis le réseau
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_STATIC_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error('[SW] Erreur lors du fetch de la ressource statique:', error);
        throw error;
    }
}

/**
 * Gestion des requêtes dynamiques
 * Network First
 */
async function handleDynamicRequest(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_DYNAMIC_NAME);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * Met à jour le cache en arrière-plan
 */
async function updateCacheInBackground(request) {
    try {
        const networkResponse = await fetch(request);
        const cache = await caches.open(CACHE_STATIC_NAME);
        cache.put(request, networkResponse.clone());
    } catch (error) {
        // Mise à jour en arrière-plan échouée, ce n'est pas critique
        console.log('[SW] Mise à jour en arrière-plan échouée pour:', request.url);
    }
}

/**
 * Détermine si une ressource est statique
 */
function isStaticResource(request) {
    const url = new URL(request.url);
    const extension = url.pathname.split('.').pop();
    const staticExtensions = ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'webp'];
    return staticExtensions.includes(extension);
}

/**
 * Gestion des messages depuis l'application principale
 */
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * Gestion des erreurs globales
 */
self.addEventListener('error', event => {
    console.error('[SW] Erreur globale:', event.error);
});

console.log('[SW] Service Worker TooGood initialisé');
