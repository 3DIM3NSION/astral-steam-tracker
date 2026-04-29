import { DiscordWebhookError } from '../utils/errors.js';

const DEFAULT_TIMEOUT_MS = 15_000;

async function postWebhook(url, payload, { timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'user-agent': 'astral-steam-tracker/1.0',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    throw new DiscordWebhookError('Network error posting to Discord webhook', { cause: err });
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) {
    let retryAfter = 1;
    try {
      const data = await res.json();
      retryAfter = Number(data.retry_after) || 1;
    } catch { /* ignore */ }
    return { rateLimited: true, retryAfter };
  }

  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch { /* ignore */ }
    throw new DiscordWebhookError(`Discord webhook HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  return { rateLimited: false };
}

export async function sendEmbed({ webhookUrl, embed, content, allowedMentions }) {
  if (!webhookUrl) throw new DiscordWebhookError('No webhook URL provided');
  const payload = {
    embeds: [embed],
    ...(content ? { content } : {}),
    ...(allowedMentions ? { allowed_mentions: allowedMentions } : {}),
  };
  let attempt = 0;
  while (attempt < 3) {
    const result = await postWebhook(webhookUrl, payload);
    if (!result.rateLimited) return;
    const wait = Math.max(1, Math.ceil(result.retryAfter)) * 1000;
    await new Promise((r) => setTimeout(r, wait));
    attempt += 1;
  }
  throw new DiscordWebhookError('Discord webhook rate-limited 3 times in a row');
}
