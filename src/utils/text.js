// Steam news contents arrive as a mix of HTML, BBCode, and raw markdown-ish
// fragments. We sanitize them for embed display.

const HTML_ENTITIES = {
  nbsp: ' ',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  '#39': "'",
  '#34': '"',
};

function decodeEntities(s) {
  return s.replace(/&(#?[a-z0-9]+);/gi, (m, name) => {
    const k = name.toLowerCase();
    if (HTML_ENTITIES[k]) return HTML_ENTITIES[k];
    if (k.startsWith('#')) {
      const code = Number.parseInt(k.slice(1), 10);
      if (Number.isFinite(code)) return String.fromCharCode(code);
    }
    return m;
  });
}

const BLOCK_TAGS = /\[\/?(h[1-6]|p|list|ul|ol|li|table|tr|td|th|quote|code|hr|spoiler|noparse)[^\]]*\]/gi;

function stripBBCode(s) {
  // Drop list/table/img/url tags entirely; keep inner text for [b]/[i]/etc.
  let out = s;
  // [img]...[/img]
  out = out.replace(/\[img\][\s\S]*?\[\/img\]/gi, '');
  // [url=...]text[/url] -> text
  out = out.replace(/\[url=[^\]]*\]([\s\S]*?)\[\/url\]/gi, '$1');
  // [url]link[/url]
  out = out.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '$1');
  // Block-level tags: replace with newline so adjacent words don't fuse.
  out = out.replace(BLOCK_TAGS, '\n');
  // [*] list bullet
  out = out.replace(/\[\*\]/g, '\n• ');
  // generic remaining open/close tags: [b], [/b], [i], etc.
  out = out.replace(/\[\/?[a-z0-9][^\]]*\]/gi, '');
  return out;
}

function stripHtml(s) {
  return s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, '');
}

export function sanitizeNewsContent(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let s = raw;
  s = stripHtml(s);
  s = stripBBCode(s);
  s = decodeEntities(s);
  s = s.replace(/\r/g, '');
  s = s.replace(/[ \t]+\n/g, '\n');
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/[ \t]{2,}/g, ' ');
  return s.trim();
}

export function summarize(raw, max = 280) {
  const clean = sanitizeNewsContent(raw);
  if (!clean) return '';
  // Prefer the first non-empty line that looks like prose.
  const firstBlock = clean.split('\n').map((l) => l.trim()).find((l) => l.length > 0) ?? '';
  // If first block is short (a header), include the next chunk too.
  let candidate = firstBlock;
  if (candidate.length < 80) {
    const more = clean.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 4).join(' ');
    candidate = more;
  }
  if (candidate.length <= max) return candidate;
  // Truncate on a word boundary.
  const cut = candidate.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function truncate(s, max) {
  if (!s) return '';
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trimEnd()}…`;
}
