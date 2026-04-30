import { formatNow, isoNow } from '../utils/time.js';
import { sanitizeNewsContent, summarize, truncate } from '../utils/text.js';
import { steamHeaderImage, steamNewsUrl } from '../steam/steamMedia.js';

const FIELD_VALUE_MAX = 1024;
const DESCRIPTION_MAX = 4000;

// Discord rejects URLs that contain unescaped characters such as spaces,
// brackets, or other reserved-but-unencoded sub-delims. encodeURI is
// idempotent for already-encoded inputs (it only escapes characters that
// are not already part of a valid URI).
function safeUrl(u) {
  if (!u || typeof u !== 'string') return '';
  try {
    return encodeURI(u).replace(/\(/g, '%28').replace(/\)/g, '%29');
  } catch {
    return '';
  }
}

function safeMarkdownLink(text, url) {
  const safe = safeUrl(url);
  if (!safe) return text;
  // square brackets in the visible text break markdown link parsing
  const cleanText = text.replace(/\[/g, '(').replace(/\]/g, ')');
  return `[${cleanText}](${safe})`;
}

function buildBuildLines({ latestBuildId, previousBuildId, latestNewsTitle }) {
  const lines = [];
  if (latestBuildId) {
    lines.push(`Build \`${latestBuildId}\` is available on Steam.`);
    if (previousBuildId && String(previousBuildId) === String(latestBuildId)) {
      lines.push('No build change since last poll — manual re-broadcast.');
    } else if (previousBuildId) {
      lines.push(`Previous build \`${previousBuildId}\` retired.`);
    } else {
      lines.push('Previous build unknown — first time tracking this product.');
    }
  } else if (latestNewsTitle) {
    lines.push(`New Steam update detected: \`${truncate(latestNewsTitle, 120)}\`.`);
  } else {
    lines.push('A new Steam update has been detected.');
  }
  return lines;
}

function buildPatchSummaryLines({ news, gameName }) {
  if (!news) return [];
  const lines = [''];
  const summary = summarize(news.contents, 240);
  if (summary) {
    lines.push(summary);
  } else if (news.title) {
    lines.push(`${gameName} update — ${news.title}`);
  }
  if (news.title && news.url) {
    lines.push(safeMarkdownLink(truncate(news.title, 200), news.url));
  }
  return lines;
}

function buildWhatsNewValue({ news, gameName }) {
  if (news?.contents) {
    const summary = summarize(news.contents, 700);
    if (summary) return truncate(summary, FIELD_VALUE_MAX);
  }
  return `A new Steam update is live for ${gameName}. Patch contents were not provided in the Steam news feed.`;
}

function resolveImageUrl({ game, env }) {
  if (game.imageUrl) return game.imageUrl;
  if (env.embed.fallbackImageUrl) return env.embed.fallbackImageUrl;
  return steamHeaderImage(game.steamAppId);
}

function resolvePatchUrl({ game, news }) {
  if (game.patchNotesUrlOverride) return game.patchNotesUrlOverride;
  if (news?.url) return news.url;
  return steamNewsUrl(game.steamAppId);
}

export function buildUpdateEmbed({ env, game, latest, previous }) {
  const gameName = game.name;
  const latestBuildId = latest?.build?.buildId ?? null;
  const previousBuildId = previous?.lastBuildId ?? null;
  const news = latest?.news ?? null;

  const sanitizedNews = news
    ? { ...news, contents: sanitizeNewsContent(news.contents) }
    : null;

  const descriptionLines = [
    ...buildBuildLines({
      latestBuildId,
      previousBuildId,
      latestNewsTitle: sanitizedNews?.title ?? null,
    }),
    ...buildPatchSummaryLines({ news: sanitizedNews, gameName }),
  ];

  const description = truncate(descriptionLines.join('\n'), DESCRIPTION_MAX);

  const fields = [
    {
      name: "What's new",
      value: buildWhatsNewValue({ news: sanitizedNews, gameName }),
      inline: false,
    },
  ];

  const footerSuffix = formatNow({
    timeZone: env.time.timezone,
    format: env.time.format,
  });

  const embed = {
    title: `${gameName} · update now live`,
    url: safeUrl(resolvePatchUrl({ game, news: sanitizedNews })),
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

  const imageUrl = safeUrl(resolveImageUrl({ game, env }));
  if (imageUrl) embed.image = { url: imageUrl };

  // Drop empty url field — Discord rejects empty strings.
  if (!embed.url) delete embed.url;

  return embed;
}

export function buildTestEmbed({ env }) {
  const footerSuffix = formatNow({
    timeZone: env.time.timezone,
    format: env.time.format,
  });
  return {
    title: 'Astral Steam Tracker · startup test',
    description:
      'Webhook delivery is operational. Branding values are sourced from `.env`.\nThis is a non-game test embed.',
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
