const DEFAULT_TIMEZONE = 'America/Chicago';
const DEFAULT_FORMAT = 'YYYY-MM-DD hh:mm A';

function pad(n, width = 2) {
  return String(n).padStart(width, '0');
}

function getParts(date, timeZone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value]),
  );
  const hour12 = parts.hour;
  const hour24Fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    hour12: false,
  });
  const hour24 = hour24Fmt.formatToParts(date).find((p) => p.type === 'hour')?.value ?? '00';
  return {
    YYYY: parts.year,
    MM: parts.month,
    DD: parts.day,
    hh: hour12,
    HH: hour24 === '24' ? '00' : hour24,
    mm: parts.minute,
    ss: parts.second,
    A: parts.dayPeriod ?? (Number(hour24) >= 12 ? 'PM' : 'AM'),
  };
}

export function formatDate(date, options = {}) {
  const tz = options.timeZone ?? process.env.TRACKER_TIMEZONE ?? DEFAULT_TIMEZONE;
  const fmt = options.format ?? process.env.TRACKER_DATE_FORMAT ?? DEFAULT_FORMAT;
  const parts = getParts(date instanceof Date ? date : new Date(date), tz);
  return fmt
    .replace(/YYYY/g, parts.YYYY)
    .replace(/MM/g, parts.MM)
    .replace(/DD/g, parts.DD)
    .replace(/HH/g, parts.HH)
    .replace(/hh/g, parts.hh)
    .replace(/mm/g, parts.mm)
    .replace(/ss/g, parts.ss)
    .replace(/A/g, parts.A);
}

export function formatNow(options = {}) {
  return formatDate(new Date(), options);
}

export function isoNow() {
  return new Date().toISOString();
}
