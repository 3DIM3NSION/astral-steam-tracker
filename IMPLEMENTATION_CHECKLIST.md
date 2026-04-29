# Implementation Checklist

Use this checklist after Claude generates the actual bot.

## Project Structure

- [ ] `package.json` exists.
- [ ] `.env.example` exists.
- [ ] `README.md` exists.
- [ ] `config/games.json` exists.
- [ ] `data/update-state.json` exists or is auto-created safely.
- [ ] `src/index.js` exists.
- [ ] Steam provider files exist.
- [ ] Discord webhook files exist.
- [ ] State service exists.
- [ ] Logging utility exists.
- [ ] Test scripts exist.

## Configuration

- [ ] Discord webhook is read from `.env`.
- [ ] Embed color is read from `.env`.
- [ ] Author name is read from `.env`.
- [ ] Author icon is read from `.env`.
- [ ] Footer text is read from `.env`.
- [ ] Footer icon is read from `.env`.
- [ ] Poll interval is read from `.env`.
- [ ] Timezone is read from `.env`.
- [ ] Game config path is read from `.env`.
- [ ] State file path is read from `.env`.
- [ ] Game-specific webhook can override global webhook.
- [ ] No branding is hardcoded into implementation files.

## Game Tracking

- [ ] All requested games are present in config.
- [ ] Each game has a stable `key`.
- [ ] Each game has a display `name`.
- [ ] Each Steam-backed game supports `steamAppId`.
- [ ] Games with uncertain Steam IDs are clearly marked.
- [ ] Disabled games are skipped cleanly.
- [ ] One failed game does not stop the full loop.

## Update Detection

- [ ] Build ID changes are detected when available.
- [ ] Steam news changes are detected when build ID is unavailable.
- [ ] Latest update source URL is stored.
- [ ] Latest patch title is stored.
- [ ] Previous tracked build/news state is stored.
- [ ] First startup does not spam old updates.
- [ ] Duplicate updates are not posted after restart.

## Discord Embeds

- [ ] Embed title format is `[Game Name] · update now live`.
- [ ] Embed shows `Steam build changed:`.
- [ ] Embed shows previous tracked build/state.
- [ ] Embed shows latest build/state.
- [ ] Embed uses arrow format: `old → new`.
- [ ] Embed includes patch notes link.
- [ ] Embed includes operational “What’s new” copy.
- [ ] Embed includes game image/banner when configured.
- [ ] Embed footer reads `Astral Projects • Tracker • Date/Time`.
- [ ] Embed color is red by default.
- [ ] Embed color is adjustable.
- [ ] Embed author/icon are adjustable.
- [ ] Embed footer/icon are adjustable.

## Error Handling

- [ ] Steam fetch failure retries once.
- [ ] Steam fetch failure logs clearly.
- [ ] Discord webhook failure logs clearly.
- [ ] Discord webhook failure does not save state as posted.
- [ ] State write failure logs clearly.
- [ ] Invalid game config logs clearly.
- [ ] Missing webhook logs clearly.
- [ ] No silent catches.

## Scripts

- [ ] `npm run start` works.
- [ ] `npm run dev` works.
- [ ] `npm run test:embed` sends a sample embed.
- [ ] `npm run force-check` runs one full scan.
- [ ] Optional `npm run force-post cs2` works.

## Operations

- [ ] PM2 instructions exist.
- [ ] Logs are readable.
- [ ] Bot can run continuously.
- [ ] Restart behavior is safe.
- [ ] Config changes are documented.
