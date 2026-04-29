import { formatNow } from './time.js';

const LEVEL_COLORS = {
  info: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  debug: '\x1b[90m',
  ok: '\x1b[32m',
};
const RESET = '\x1b[0m';

function format(level, scope, message, extra) {
  const ts = formatNow();
  const color = LEVEL_COLORS[level] ?? '';
  const head = `${color}[${ts}] [${level.toUpperCase()}]${RESET} ${scope ? `(${scope}) ` : ''}`;
  if (extra !== undefined) {
    return `${head}${message} ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`;
  }
  return `${head}${message}`;
}

export function createLogger(scope) {
  const debugEnabled = String(process.env.ENABLE_DEBUG_LOGS ?? 'true').toLowerCase() === 'true';
  return {
    info: (msg, extra) => console.log(format('info', scope, msg, extra)),
    ok: (msg, extra) => console.log(format('ok', scope, msg, extra)),
    warn: (msg, extra) => console.warn(format('warn', scope, msg, extra)),
    error: (msg, extra) => console.error(format('error', scope, msg, extra)),
    debug: (msg, extra) => {
      if (debugEnabled) console.log(format('debug', scope, msg, extra));
    },
  };
}
