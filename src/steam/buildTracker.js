import { fetchLatestBuildId } from './steamClient.js';

export async function getBuildSnapshot(appId) {
  const { buildId, timeUpdated, branch } = await fetchLatestBuildId(appId);
  return {
    buildId,
    timeUpdated,
    branch,
  };
}

export function buildChanged(previous, latest) {
  if (!latest?.buildId) return false;
  if (!previous?.lastBuildId) return true;
  return String(previous.lastBuildId) !== String(latest.buildId);
}
