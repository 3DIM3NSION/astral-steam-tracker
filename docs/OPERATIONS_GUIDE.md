# Operations Guide

## Normal Runtime

The bot should run continuously and check all enabled games on a configured interval.

Default interval:

```env
STEAM_POLL_INTERVAL_MINUTES=5
```

## Startup Behavior

On first startup with an empty state file:

- Fetch current Steam state.
- Save baseline values.
- Do not post old updates unless startup test mode is enabled.

Startup test mode:

```env
ENABLE_STARTUP_TEST=true
```

Only use startup test mode when intentionally testing embed output.

## PM2 Deployment

Expected command after implementation:

```bash
pm2 start src/index.js --name astral-steam-tracker
pm2 save
pm2 logs astral-steam-tracker
```

Restart:

```bash
pm2 restart astral-steam-tracker
```

Stop:

```bash
pm2 stop astral-steam-tracker
```

## Update Day Flow

When an update is detected:

1. Bot detects Steam build/news change.
2. Bot compares previous tracked value against latest value.
3. Bot sends Discord embed.
4. Bot saves state only after webhook delivery succeeds.
5. Team reviews patch notes.
6. Team verifies product compatibility.
7. Team marks product as updated internally.

## Recommended Discord Channel Setup

For v1:

- One channel for all update notifications.
- One webhook configured in `.env`.

Future:

- Per-game channels.
- Per-game webhook overrides inside `config/games.json`.
- Optional role pings per game.

## Logging Categories

Expected categories:

```txt
[BOOT]
[CONFIG]
[STEAM]
[TRACKER]
[DISCORD]
[STATE]
[ERROR]
```

## Troubleshooting

### Bot starts but does not post

Check:

- Is this first startup with empty state?
- Is `ENABLE_STARTUP_TEST=false`?
- Did the tracker detect no new update?
- Is the webhook URL valid?

### Bot posts duplicates

Check:

- Is state file being saved?
- Is state file path correct?
- Is Discord post failing before state save?
- Is the game key changing between runs?

### One game keeps failing

Check:

- Steam app ID.
- Whether Steam news endpoint is available.
- Whether that game uses a launcher/hub app.
- Whether a patch notes override is needed.

### Embed branding is wrong

Check:

- `.env` values.
- Game-specific image URL.
- Fallback image URL.
- Whether implementation hardcoded values incorrectly.
