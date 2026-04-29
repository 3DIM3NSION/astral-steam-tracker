import { formatNow, isoNow } from '../utils/time.js';

const WHATS_NEW_TEMPLATE = (gameName) =>
  `A new Steam update is live for ${gameName}. Review the linked patch notes, compare changes against the previous tracked build, and verify product compatibility before marking this product as updated.`;

function buildBuildComparison({ previousBuildId, latestBuildId, previousNewsTitle, latestNewsTitle }) {
  if (latestBuildId) {
    const prev = previousBuildId ? String(previousBuildId) : 'Unknown';
    return `Steam build changed:\n${prev} → ${latestBuildId}`;
  }
  if (latestNewsTitle) {
    const prev = previousNewsTitle ? previousNewsTitle : 'Unknown';
    return `Steam update changed:\n${prev} → ${latestNewsTitle}`;
  }
  return 'Steam update detected.';
}

function buildPatchNotesField({ patchTitle, patchUrl }) {
  if (patchTitle && patchUrl) {
    return `[${patchTitle}](${patchUrl})`;
  }
  if (patchTitle) return patchTitle;
  return 'Steam update source unavailable';
}

export function buildUpdateEmbed({ env, game, latest, previous }) {
  const gameName = game.name;
  const latestBuildId = latest?.build?.buildId ?? null;
  const previousBuildId = previous?.lastBuildId ?? null;
  const patchTitle = latest?.news?.title ?? previous?.lastPatchTitle ?? null;
  const patchUrl =
    game.patchNotesUrlOverride ||
    latest?.news?.url ||
    (game.steamAppId ? `https://store.steampowered.com/news/app/${game.steamAppId}` : '');

  const description = [
    buildBuildComparison({
      previousBuildId,
      latestBuildId,
      previousNewsTitle: previous?.lastPatchTitle ?? null,
      latestNewsTitle: latest?.news?.title ?? null,
    }),
  ].join('\n');

  const fields = [
    {
      name: 'Patch notes',
      value: buildPatchNotesField({ patchTitle, patchUrl }),
      inline: false,
    },
    {
      name: "What's new",
      value: WHATS_NEW_TEMPLATE(gameName),
      inline: false,
    },
  ];

  const footerSuffix = formatNow({
    timeZone: env.time.timezone,
    format: env.time.format,
  });

  const embed = {
    title: `${gameName} · update now live`,
    description,
    color: env.embed.color,
    fields,
    timestamp: isoNow(),
    footer: {
      text: `${env.embed.footerText} • ${footerSuffix}`,
      ...(env.embed.footerIconUrl ? { icon_url: env.embed.footerIconUrl } : {}),
    },
    author: {
      name: env.embed.authorName,
      ...(env.embed.authorIconUrl ? { icon_url: env.embed.authorIconUrl } : {}),
    },
  };

  const imageUrl = game.imageUrl || env.embed.fallbackImageUrl;
  if (imageUrl) embed.image = { url: imageUrl };

  return embed;
}

export function buildTestEmbed({ env }) {
  const footerSuffix = formatNow({
    timeZone: env.time.timezone,
    format: env.time.format,
  });
  return {
    title: 'Astral Steam Tracker · startup test',
    description: 'Webhook delivery is operational. Branding values are sourced from `.env`.',
    color: env.embed.color,
    fields: [
      {
        name: 'Status',
        value: 'Connection verified. Awaiting Steam build/news changes for tracked games.',
        inline: false,
      },
    ],
    footer: {
      text: `${env.embed.footerText} • ${footerSuffix}`,
      ...(env.embed.footerIconUrl ? { icon_url: env.embed.footerIconUrl } : {}),
    },
    author: {
      name: env.embed.authorName,
      ...(env.embed.authorIconUrl ? { icon_url: env.embed.authorIconUrl } : {}),
    },
    timestamp: isoNow(),
  };
}
