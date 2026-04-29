# Claude Build Prompt — Astral Steam Update Tracker Bot

You are building a production-ready Discord update tracker for **Astral Projects**.

The bot’s purpose is to track game updates through Steam and automatically post polished Discord embeds when a monitored game receives a new build/update.

I will attach reference screenshots. Match the overall embed quality, spacing, structure, seriousness, and premium presentation shown in the screenshots.

This scaffold already contains the roadmap, folder plan, embed spec, config spec, QA plan, and release criteria. Build directly into this structure.

━━━━━━━━━━━━━━━━━━━━

## Core Goal

Create a Discord tracker that monitors Steam updates for these games:

- Counter-Strike 2
- Marvel Rivals
- Apex Legends
- Overwatch
- Dead by Daylight
- Deadlock
- Escape from Tarkov
- DayZ
- Battlefield 6
- Rust
- Rainbow Six Siege
- Call of Duty
- Path of Exile 2

The tracker should detect Steam build/news changes and post an embed to Discord when a new update is live.

For now, all game update embeds should post into **one shared webhook channel**.

Later, the system must be easy to expand so each game can have its own webhook/channel.

━━━━━━━━━━━━━━━━━━━━

## Important Requirement

Do not give me a prototype.
Do not give me placeholder-only logic.
Do not create dead code.
Do not hardcode branding, webhooks, colors, image URLs, or game IDs into random files.

Build this cleanly with a proper config-driven structure.

The `.env` file should be the main source of truth for:

- Discord webhook URL
- Embed color
- Author name
- Author icon
- Footer text
- Footer icon
- Polling interval
- Timezone/date format
- Game configuration path
- Steam API key if needed
- Whether pings are enabled
- Optional role pings per game
- Optional fallback image
- Logging mode/debug mode

━━━━━━━━━━━━━━━━━━━━

## Preferred Stack

Use:

- Node.js 20+
- ESM modules
- discord.js v14 or native webhook posting with `fetch`
- `node-cron` or a clean polling loop
- Local JSON persistence for last known build/news state
- Clean modular structure
- No database required for v1

The tracker should be able to run with:

```bash
npm install
npm run start
```

Also include:

```bash
npm run dev
```

for development mode.

━━━━━━━━━━━━━━━━━━━━

## Tracking Requirements

The system should track updates using Steam data.

Implement a clean Steam provider layer.

The tracker should support:

1. Steam app ID per game
2. Last known build ID if available
3. Latest Steam news/patch note entry
4. Update source URL
5. Game image/banner URL
6. Game display name
7. Optional Discord mention/role ping
8. Optional enabled/disabled flag per game

Important:

- Do not assume every game exposes data the same way.
- Do not hard-fail the entire bot if one game fails.
- If build ID is not available through a reliable Steam source, gracefully fall back to Steam news/update date detection.
- If Steam news is available, include a direct link to the Steam update/news page.
- Do not spam duplicate embeds.
- Persist state so restarts do not repost old updates.
- Include a manual force-check command/script for testing.

Expected behavior:

```txt
Bot checks all configured games.
If a game has a newer build/news entry than last stored state:
  - Send a Discord embed
  - Save the new posted state only after successful Discord delivery
If nothing changed:
  - Log cleanly and do nothing
```

━━━━━━━━━━━━━━━━━━━━

## Previous Build Comparison Requirement

Every update embed should reference the previous tracked version/build when available.

The embed should show both:

- Previous tracked build
- Latest Steam build

Preferred format:

```txt
Steam build changed:
22948122 → 22948967
```

If the previous build is unavailable, use:

```txt
Steam build changed:
Unknown → 22948967
```

Do not hide the old build.
Do not only show the new build.
The entire point is to make updates comparable at a glance.

━━━━━━━━━━━━━━━━━━━━

## Embed Style Requirements

All embeds should look premium and clean, like the attached screenshots.

Default color should be red, but adjustable in `.env`.

Embed structure should be:

```txt
[Game Name] · update now live

Steam build changed:
[OLD_BUILD_ID] → [NEW_BUILD_ID]

Patch notes
[Clickable patch notes title/source link]

What's new
A new Steam update is live for [Game Name]. Review the linked patch notes, compare changes against the previous tracked build, and verify product compatibility before marking this product as updated.

[Image/banner]

Footer:
Astral Projects • Tracker • Date/Time
```

Footer format should read like:

```txt
Astral Projects • Tracker • 2026-04-26 12:14 AM
```

Make the footer text configurable.

Use this default footer text style:

```txt
Astral Projects • Tracker
```

Date/time should be appended automatically.

The embed should include:

- Author name from env
- Author icon from env
- Red embed color from env
- Game title
- Previous tracked build/news state
- Latest Steam build/news state
- Patch notes link
- “What’s new” section
- Game banner/image
- Footer text + timestamp
- Footer icon if configured

Avoid childish wording.
Avoid emoji spam.
Keep it serious, premium, and operational.

━━━━━━━━━━━━━━━━━━━━

## Game Config

Create a config file like:

```json
[
  {
    "key": "cs2",
    "name": "Counter-Strike 2",
    "steamAppId": "730",
    "enabled": true,
    "imageUrl": "",
    "patchNotesUrlOverride": "",
    "roleMention": "",
    "webhookUrl": ""
  },
  {
    "key": "rust",
    "name": "Rust",
    "steamAppId": "252490",
    "enabled": true,
    "imageUrl": "",
    "patchNotesUrlOverride": "",
    "roleMention": "",
    "webhookUrl": ""
  }
]
```

Do not hardcode all logic around only these two examples.
Add all games listed above to the config.

If exact Steam app IDs are uncertain, leave them clearly marked in the config and add notes in the setup guide telling me where to fill them in.

For games with multiple Steam app IDs or launchers, structure the config so this is easy to adjust later.

━━━━━━━━━━━━━━━━━━━━

## Environment File

Create a complete `.env.example`.

It should include:

```env
DISCORD_WEBHOOK_URL=

EMBED_COLOR=#ff2b4f
EMBED_AUTHOR_NAME=Astral
EMBED_AUTHOR_ICON_URL=
EMBED_FOOTER_TEXT=Astral Projects • Tracker
EMBED_FOOTER_ICON_URL=

STEAM_API_KEY=
STEAM_POLL_INTERVAL_MINUTES=5

TRACKER_TIMEZONE=America/Chicago
TRACKER_DATE_FORMAT=YYYY-MM-DD hh:mm A

GAME_CONFIG_PATH=./config/games.json
STATE_FILE_PATH=./data/update-state.json

ENABLE_ROLE_PINGS=false
ENABLE_DEBUG_LOGS=true
ENABLE_STARTUP_TEST=false

FALLBACK_IMAGE_URL=
```

The webhook URL in the game config should override the global webhook only if set.

This allows:

- one webhook for all games now
- separate channels later

━━━━━━━━━━━━━━━━━━━━

## File Structure

Build this structure:

```txt
astral-steam-tracker/
├─ package.json
├─ .env.example
├─ README.md
├─ config/
│  └─ games.json
├─ data/
│  └─ update-state.json
├─ src/
│  ├─ index.js
│  ├─ config/
│  │  └─ env.js
│  ├─ steam/
│  │  ├─ steamClient.js
│  │  ├─ buildTracker.js
│  │  └─ newsTracker.js
│  ├─ discord/
│  │  ├─ webhookClient.js
│  │  └─ embedBuilder.js
│  ├─ services/
│  │  ├─ trackerService.js
│  │  └─ stateService.js
│  ├─ utils/
│  │  ├─ logger.js
│  │  ├─ time.js
│  │  └─ errors.js
│  └─ scripts/
│     ├─ forceCheck.js
│     └─ sendTestEmbed.js
```

Keep the project clean and readable.

━━━━━━━━━━━━━━━━━━━━

## Logging Requirements

Use clean console logging.

Log categories:

```txt
[BOOT]
[CONFIG]
[STEAM]
[TRACKER]
[DISCORD]
[STATE]
[ERROR]
```

Examples:

```txt
[BOOT] Astral Steam Tracker starting...
[CONFIG] Loaded 13 tracked games.
[TRACKER] Checking Counter-Strike 2...
[STEAM] Counter-Strike 2 latest build: 22948967
[DISCORD] Posted update embed for Counter-Strike 2.
[STATE] Saved latest state for Counter-Strike 2.
```

No silent failures.

Every caught error should include:

- Game name if relevant
- Operation that failed
- Error message
- Whether the bot continued or stopped

━━━━━━━━━━━━━━━━━━━━

## Duplicate Prevention

The bot must never repost the same update repeatedly.

Use `data/update-state.json` to store state like:

```json
{
  "cs2": {
    "lastBuildId": "22948967",
    "lastNewsGid": "123456789",
    "lastPostedAt": "2026-04-26T05:14:00.000Z"
  }
}
```

Comparison rules:

1. If build ID exists and changed, post.
2. If build ID is unavailable but latest news ID changed, post.
3. If neither changed, do not post.
4. If state file is empty on first startup, save current state without posting unless `ENABLE_STARTUP_TEST=true`.
5. If Discord webhook delivery fails, do not save the new state as posted.

This prevents spam when first deploying.

━━━━━━━━━━━━━━━━━━━━

## Error Handling

The tracker should be resilient.

If one game fails:

- Log the error
- Continue checking other games
- Do not crash the whole bot

If Discord webhook fails:

- Log the failed payload title/game
- Do not update state as posted unless the webhook succeeds

If Steam fails:

- Retry once
- If still failing, skip that game until the next interval

━━━━━━━━━━━━━━━━━━━━

## Test Tools

Add test scripts:

```bash
npm run test:embed
npm run force-check
```

`test:embed` should send a single sample embed using fake data.

`force-check` should run the tracker once immediately.

Optional:

```bash
npm run force-post cs2
```

This should force-send the latest known update for one game for visual testing.

━━━━━━━━━━━━━━━━━━━━

## README Requirements

Create a full README with:

1. Installation steps
2. `.env` setup
3. How to add a Discord webhook
4. How to add/change games
5. How to add game images
6. How polling works
7. How duplicate prevention works
8. How to test embeds
9. How to run with PM2
10. Troubleshooting section

Include PM2 example:

```bash
pm2 start src/index.js --name astral-steam-tracker
pm2 save
pm2 logs astral-steam-tracker
```

━━━━━━━━━━━━━━━━━━━━

## Quality Bar

Before finishing, audit the project.

Check for:

- No placeholders except clearly documented missing Steam app IDs/image URLs
- No dead code
- No hardcoded branding outside `.env` or config
- No duplicate embed sends
- No crash when one game fails
- No messy console spam
- No hidden silent errors
- Clean, professional embed output
- Previous build and latest build shown in embeds
- Easy future migration to per-game webhook channels
- Easy future migration from JSON state to database

━━━━━━━━━━━━━━━━━━━━

## Final Output Expected From You

Return:

1. Full file tree
2. Every file’s code
3. Setup instructions
4. `.env.example`
5. `games.json`
6. README
7. Notes on any Steam app IDs that need verification
8. Exact command list to install, test, and run

Do not skip files.
Do not summarize instead of coding.
Build the actual bot.
