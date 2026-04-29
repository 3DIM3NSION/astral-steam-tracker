import 'dotenv/config';
import path from 'node:path';
import { ConfigError } from '../utils/errors.js';

function bool(value, fallback = false) {
  if (value === undefined || value === null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function int(value, fallback) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function colorToInt(value, fallback = 0xff2b4f) {
  if (!value) return fallback;
  const hex = String(value).trim().replace(/^#/, '');
  const n = Number.parseInt(hex, 16);
  return Number.isFinite(n) ? n : fallback;
}

function resolvePath(p) {
  if (!p) return p;
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

export function loadEnv() {
  const env = {
    discord: {
      webhookUrl: process.env.DISCORD_WEBHOOK_URL?.trim() ?? '',
    },
    embed: {
      color: colorToInt(process.env.EMBED_COLOR, 0xff2b4f),
      colorRaw: process.env.EMBED_COLOR ?? '#ff2b4f',
      authorName: process.env.EMBED_AUTHOR_NAME?.trim() || 'Astral',
      authorIconUrl: process.env.EMBED_AUTHOR_ICON_URL?.trim() || '',
      footerText: process.env.EMBED_FOOTER_TEXT?.trim() || 'Astral Projects • Tracker',
      footerIconUrl: process.env.EMBED_FOOTER_ICON_URL?.trim() || '',
      fallbackImageUrl: process.env.FALLBACK_IMAGE_URL?.trim() || '',
    },
    steam: {
      apiKey: process.env.STEAM_API_KEY?.trim() || '',
      pollIntervalMinutes: int(process.env.STEAM_POLL_INTERVAL_MINUTES, 5),
    },
    time: {
      timezone: process.env.TRACKER_TIMEZONE?.trim() || 'America/Chicago',
      format: process.env.TRACKER_DATE_FORMAT?.trim() || 'YYYY-MM-DD hh:mm A',
    },
    paths: {
      gamesConfig: resolvePath(process.env.GAME_CONFIG_PATH || './config/games.json'),
      stateFile: resolvePath(process.env.STATE_FILE_PATH || './data/update-state.json'),
    },
    flags: {
      enableRolePings: bool(process.env.ENABLE_ROLE_PINGS, false),
      enableDebugLogs: bool(process.env.ENABLE_DEBUG_LOGS, true),
      enableStartupTest: bool(process.env.ENABLE_STARTUP_TEST, false),
    },
  };

  if (!env.discord.webhookUrl) {
    throw new ConfigError('DISCORD_WEBHOOK_URL is not set in .env');
  }
  if (env.steam.pollIntervalMinutes < 1) {
    throw new ConfigError('STEAM_POLL_INTERVAL_MINUTES must be >= 1');
  }

  return env;
}
