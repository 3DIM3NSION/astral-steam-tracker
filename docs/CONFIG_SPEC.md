# Configuration Specification

## Configuration Philosophy

For v1, `.env` is the main source of truth for runtime settings, branding, and webhook defaults.

`config/games.json` is the main source of truth for tracked products/games.

No branding, webhook URLs, colors, or image URLs should be hardcoded into implementation files.

## Environment Variables

Required:

```env
DISCORD_WEBHOOK_URL=
```

Branding:

```env
EMBED_COLOR=#ff2b4f
EMBED_AUTHOR_NAME=Astral
EMBED_AUTHOR_ICON_URL=
EMBED_FOOTER_TEXT=Astral Projects • Tracker
EMBED_FOOTER_ICON_URL=
```

Steam/polling:

```env
STEAM_API_KEY=
STEAM_POLL_INTERVAL_MINUTES=5
```

Time:

```env
TRACKER_TIMEZONE=America/Chicago
TRACKER_DATE_FORMAT=YYYY-MM-DD hh:mm A
```

Paths:

```env
GAME_CONFIG_PATH=./config/games.json
STATE_FILE_PATH=./data/update-state.json
```

Feature toggles:

```env
ENABLE_ROLE_PINGS=false
ENABLE_DEBUG_LOGS=true
ENABLE_STARTUP_TEST=false
```

Fallback media:

```env
FALLBACK_IMAGE_URL=
```

## Game Config Fields

Each game should support:

```json
{
  "key": "cs2",
  "name": "Counter-Strike 2",
  "steamAppId": "730",
  "enabled": true,
  "imageUrl": "",
  "patchNotesUrlOverride": "",
  "roleMention": "",
  "webhookUrl": "",
  "notes": ""
}
```

### key

Stable internal identifier.

Examples:

```txt
cs2
rust
marvel_rivals
path_of_exile_2
```

### name

Display name used in embeds.

### steamAppId

Steam application ID.

If uncertain, leave blank and document the game in the tracking matrix.

### enabled

If false, game should be skipped cleanly.

### imageUrl

Game-specific embed banner/image.

### patchNotesUrlOverride

Optional manual patch notes URL.

Useful for games that have official update pages outside Steam or complex news behavior.

### roleMention

Optional role mention for future per-game pings.

Should only be used when `ENABLE_ROLE_PINGS=true`.

### webhookUrl

Optional per-game webhook override.

If empty, use global `DISCORD_WEBHOOK_URL`.

### notes

Internal notes for setup, Steam ID verification, or game-specific tracking limitations.
