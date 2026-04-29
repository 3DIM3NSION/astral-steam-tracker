import { SteamApiError } from '../utils/errors.js';

const NEWS_API = 'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/';
const STEAMCMD_API = 'https://api.steamcmd.net/v1/info';

const DEFAULT_TIMEOUT_MS = 15_000;

async function fetchJson(url, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'astral-steam-tracker/1.0 (+https://github.com/astral-projects)',
        accept: 'application/json',
      },
    });
  } catch (err) {
    throw new SteamApiError(`Network error fetching ${url}`, { cause: err });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    throw new SteamApiError(`HTTP ${res.status} from ${url}`);
  }
  try {
    return await res.json();
  } catch (err) {
    throw new SteamApiError(`Invalid JSON from ${url}`, { cause: err });
  }
}

export async function fetchNewsForApp(appId, { count = 5, maxLength = 600 } = {}) {
  const url = `${NEWS_API}?appid=${encodeURIComponent(appId)}&count=${count}&maxlength=${maxLength}&format=json`;
  const data = await fetchJson(url);
  const items = data?.appnews?.newsitems;
  if (!Array.isArray(items)) {
    throw new SteamApiError(`Unexpected news payload for appId=${appId}`);
  }
  return items.map((it) => ({
    gid: String(it.gid ?? ''),
    title: String(it.title ?? ''),
    url: String(it.url ?? ''),
    author: it.author ?? '',
    contents: String(it.contents ?? ''),
    feedlabel: it.feedlabel ?? '',
    date: Number.isFinite(it.date) ? it.date : 0,
    feedname: it.feedname ?? '',
    feedType: it.feed_type ?? null,
    appid: it.appid ?? Number(appId),
  }));
}

export function isPatchNotesEntry(item) {
  if (!item) return false;
  const haystack = `${item.title} ${item.feedlabel} ${item.feedname}`.toLowerCase();
  const keywords = [
    'update',
    'patch',
    'release notes',
    'hotfix',
    'patch notes',
    'changelog',
    'build notes',
  ];
  return keywords.some((k) => haystack.includes(k));
}

export async function fetchLatestBuildId(appId) {
  const url = `${STEAMCMD_API}/${encodeURIComponent(appId)}`;
  const data = await fetchJson(url);
  if (data?.status !== 'success') {
    throw new SteamApiError(`steamcmd lookup failed for appId=${appId}: ${data?.status ?? 'unknown'}`);
  }
  const appData = data?.data?.[appId];
  const branches = appData?.depots?.branches;
  if (!branches || typeof branches !== 'object') {
    return { buildId: null, timeUpdated: null, branch: null };
  }
  const publicBranch = branches.public ?? Object.values(branches)[0];
  if (!publicBranch) return { buildId: null, timeUpdated: null, branch: null };
  const buildId = publicBranch.buildid ? String(publicBranch.buildid) : null;
  const timeUpdated = publicBranch.timeupdated ? Number(publicBranch.timeupdated) : null;
  return { buildId, timeUpdated, branch: branches.public ? 'public' : Object.keys(branches)[0] };
}
