# QA Test Plan — Astral Steam Update Tracker

## Test 1 — Environment Loading

### Steps

1. Copy `.env.example` to `.env`.
2. Fill in `DISCORD_WEBHOOK_URL`.
3. Set `ENABLE_DEBUG_LOGS=true`.
4. Start the bot.

### Expected Result

- Bot starts without crashing.
- Logs show loaded config.
- Logs show loaded games.
- Missing optional values do not crash the app.

---

## Test 2 — Game Config Loading

### Steps

1. Add all target games to `config/games.json`.
2. Disable one game.
3. Start the bot.

### Expected Result

- Enabled games are checked.
- Disabled game is skipped.
- Logs clearly show how many games are loaded.

---

## Test 3 — First Startup State Safety

### Steps

1. Delete or empty `data/update-state.json`.
2. Set `ENABLE_STARTUP_TEST=false`.
3. Start the bot.

### Expected Result

- Bot fetches current Steam data.
- Bot saves baseline state.
- Bot does not post old updates to Discord.

---

## Test 4 — Test Embed

### Steps

1. Run the embed test script.
2. Review Discord output.

### Expected Result

Embed shows:

```txt
Counter-Strike 2 · update now live

Steam build changed:
22948122 → 22948967

Patch notes
Counter-Strike 2 release notes — 2026-04-26

What's new
A new Steam update is live for Counter-Strike 2. Review the linked patch notes, compare changes against the previous tracked build, and verify product compatibility before marking this product as updated.
```

Footer reads:

```txt
Astral Projects • Tracker • Date/Time
```

---

## Test 5 — Duplicate Prevention

### Steps

1. Run a force check.
2. Confirm state saves.
3. Run the same force check again.

### Expected Result

- First check may post only if state changed.
- Second check should not repost the same update.
- Logs should say no change detected.

---

## Test 6 — Failed Webhook Safety

### Steps

1. Temporarily set an invalid webhook URL.
2. Force a post.
3. Review state file.

### Expected Result

- Discord post fails.
- Error logs clearly explain webhook failure.
- State is not saved as successfully posted.

---

## Test 7 — Single Game Failure Isolation

### Steps

1. Break one game’s Steam app ID.
2. Run a full check.

### Expected Result

- Broken game logs an error.
- Remaining games still check normally.
- Bot does not crash.

---

## Test 8 — PM2 Restart Safety

### Steps

1. Start bot with PM2.
2. Stop and restart it.
3. Check logs and Discord.

### Expected Result

- Bot resumes cleanly.
- Bot does not repost old updates after restart.
- Logs remain readable.
