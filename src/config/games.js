import { readFile } from 'node:fs/promises';
import { ConfigError } from '../utils/errors.js';

function normalizeGame(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new ConfigError('Game entry must be an object');
  }
  const required = ['key', 'name', 'steamAppId'];
  for (const field of required) {
    if (!raw[field]) throw new ConfigError(`Game entry missing required field: ${field}`);
  }
  return {
    key: String(raw.key),
    name: String(raw.name),
    steamAppId: String(raw.steamAppId),
    enabled: raw.enabled !== false,
    imageUrl: raw.imageUrl ?? '',
    patchNotesUrlOverride: raw.patchNotesUrlOverride ?? '',
    roleMention: raw.roleMention ?? '',
    webhookUrl: raw.webhookUrl ?? '',
    notes: raw.notes ?? '',
  };
}

export async function loadGames(configPath) {
  let raw;
  try {
    raw = await readFile(configPath, 'utf8');
  } catch (err) {
    throw new ConfigError(`Could not read games config at ${configPath}`, { cause: err });
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ConfigError(`games config is not valid JSON: ${configPath}`, { cause: err });
  }
  if (!Array.isArray(parsed)) {
    throw new ConfigError('games config must be a JSON array');
  }
  const games = parsed.map(normalizeGame);
  const seen = new Set();
  for (const g of games) {
    if (seen.has(g.key)) throw new ConfigError(`Duplicate game key: ${g.key}`);
    seen.add(g.key);
  }
  return games;
}

export function isTrackable(game) {
  if (!game.enabled) return false;
  if (!game.steamAppId || game.steamAppId === 'VERIFY') return false;
  if (!/^\d+$/.test(game.steamAppId)) return false;
  return true;
}
