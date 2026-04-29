# Release Criteria

The bot is not production-ready until all criteria below are satisfied.

## Core Behavior

- [ ] Tracks all enabled games.
- [ ] Detects update changes.
- [ ] Sends Discord embeds.
- [ ] Does not spam duplicates.
- [ ] Saves state safely.
- [ ] Handles restarts safely.

## Embed Quality

- [ ] Embed matches reference style as closely as Discord allows.
- [ ] Title format is correct.
- [ ] Previous tracked build/state is visible.
- [ ] Latest build/state is visible.
- [ ] Patch notes link is clickable.
- [ ] Footer format is correct.
- [ ] Author icon works.
- [ ] Footer icon works if configured.
- [ ] Image/banner works if configured.

## Config Quality

- [ ] `.env` controls branding.
- [ ] `.env` controls webhook defaults.
- [ ] `.env` controls polling behavior.
- [ ] `games.json` controls tracked games.
- [ ] Per-game webhook override exists.
- [ ] Per-game role ping field exists.
- [ ] Missing optional image does not crash.

## Reliability

- [ ] One Steam failure does not crash all checks.
- [ ] Failed Discord post does not save state as posted.
- [ ] Invalid game config logs clearly.
- [ ] Missing webhook logs clearly.
- [ ] State file corruption is handled or clearly reported.

## Operations

- [ ] PM2 run instructions work.
- [ ] `npm run start` works.
- [ ] `npm run dev` works.
- [ ] `npm run test:embed` works.
- [ ] `npm run force-check` works.
- [ ] Logs are readable.
