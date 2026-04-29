# Astral Steam Update Tracker — Roadmap

## Phase 1 — Foundation

### Goal
Create a clean, config-driven tracker that can monitor Steam-backed game updates and post Discord webhook embeds.

### Tasks

- Create project structure.
- Add environment configuration loader.
- Add game configuration loader.
- Add state persistence layer.
- Add Steam provider layer.
- Add Discord webhook delivery layer.
- Add premium embed builder.
- Add scheduler/polling service.
- Add manual test scripts.
- Add README and operational documentation.

### Success Criteria

- Bot starts cleanly.
- Bot loads `.env` correctly.
- Bot loads game config correctly.
- Bot can check all enabled games.
- Bot stores last known update state.
- Bot does not repost old updates on first run.
- Bot can send a test embed.

---

## Phase 2 — Reliable Steam Tracking

### Goal
Make game update detection reliable across different Steam data behaviors.

### Tracking Priority

1. Steam build ID if available.
2. Steam news/update ID if build ID is unavailable.
3. Patch note date/title as fallback.
4. Manual override support if a game source behaves differently.

### Tasks

- Add build ID fetch logic.
- Add Steam news fetch logic.
- Add fallback detection logic.
- Store previous tracked build/news values.
- Compare previous and latest values before posting.
- Include old → new comparison in every embed.

### Success Criteria

- Build changes are detected correctly.
- News changes are detected correctly when build ID is unavailable.
- Previous tracked version is shown in the embed.
- Duplicate prevention works after restarts.

---

## Phase 3 — Discord Embed Quality

### Goal
Match the quality and structure of the provided reference screenshots.

### Tasks

- Implement red brand embed style.
- Add configurable author icon.
- Add configurable footer icon.
- Add configurable footer text.
- Append date/time automatically.
- Add game-specific image/banner support.
- Add patch note source link.
- Add serious operational wording.

### Success Criteria

- Embed is clean, premium, and easy to read.
- Embed includes old build and new build.
- Embed links to update source.
- Embed uses configured branding.
- Embed works on desktop and mobile Discord.

---

## Phase 4 — Operations & Safety

### Goal
Make the tracker safe to run continuously.

### Tasks

- Add clean categorized logging.
- Add retry behavior for Steam fetch failures.
- Add Discord webhook failure handling.
- Prevent state from updating when Discord post fails.
- Add per-game failure isolation.
- Add debug mode.
- Add PM2 guide.

### Success Criteria

- One failed game does not crash the tracker.
- One failed webhook does not corrupt state.
- Errors clearly explain what failed.
- PM2 deployment is documented.

---

## Phase 5 — Future Expansion

### Goal
Prepare for separate channels and richer dashboard control later.

### Future Features

- Per-game webhook routing.
- Per-game Discord role pings.
- Admin dashboard for editing game config.
- Database-backed state.
- Manual “mark reviewed” workflow.
- Product compatibility status tracking.
- Developer digest for update days.
- Discord slash commands for force checks.
- Web panel to preview embeds before saving.

### Success Criteria

- Current architecture does not block future per-game channels.
- Current architecture does not block database migration.
- Current architecture does not require rewriting the embed system later.
