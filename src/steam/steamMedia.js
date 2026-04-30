// Default Steam CDN media helpers. These URLs follow the standard pattern
// Steam exposes for every public store entry.

const CDN = 'https://cdn.akamai.steamstatic.com/steam/apps';

export function steamHeaderImage(appId) {
  if (!appId) return '';
  return `${CDN}/${appId}/header.jpg`;
}

export function steamLibraryHero(appId) {
  if (!appId) return '';
  return `${CDN}/${appId}/library_hero.jpg`;
}

export function steamCapsule(appId) {
  if (!appId) return '';
  return `${CDN}/${appId}/capsule_616x353.jpg`;
}

export function steamStoreUrl(appId) {
  if (!appId) return '';
  return `https://store.steampowered.com/app/${appId}`;
}

export function steamNewsUrl(appId) {
  if (!appId) return '';
  return `https://store.steampowered.com/news/app/${appId}`;
}
