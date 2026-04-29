export class TrackerError extends Error {
  constructor(message, { cause, code } = {}) {
    super(message);
    this.name = 'TrackerError';
    if (cause) this.cause = cause;
    if (code) this.code = code;
  }
}

export class ConfigError extends TrackerError {
  constructor(message, opts) {
    super(message, opts);
    this.name = 'ConfigError';
  }
}

export class SteamApiError extends TrackerError {
  constructor(message, opts) {
    super(message, opts);
    this.name = 'SteamApiError';
  }
}

export class DiscordWebhookError extends TrackerError {
  constructor(message, opts) {
    super(message, opts);
    this.name = 'DiscordWebhookError';
  }
}

export function describeError(err) {
  if (!err) return 'Unknown error';
  const parts = [err.name ?? 'Error', err.message];
  if (err.code) parts.push(`(code=${err.code})`);
  return parts.filter(Boolean).join(': ');
}
