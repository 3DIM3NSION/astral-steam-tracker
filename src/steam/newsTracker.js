import { fetchNewsForApp, isPatchNotesEntry } from './steamClient.js';

export async function getLatestPatchNotes(appId) {
  const items = await fetchNewsForApp(appId, { count: 10 });
  const patch = items.find(isPatchNotesEntry) ?? items[0];
  if (!patch) return null;
  return {
    gid: patch.gid,
    title: patch.title,
    url: patch.url,
    date: patch.date,
    feedlabel: patch.feedlabel,
  };
}

export function newsChanged(previous, latest) {
  if (!latest?.gid) return false;
  if (!previous?.lastNewsGid) return true;
  return String(previous.lastNewsGid) !== String(latest.gid);
}
