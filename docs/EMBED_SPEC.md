# Embed Specification

## Visual Direction

The Discord embeds should match the attached reference screenshots as closely as Discord allows.

Design principles:

- Premium, clean, operational.
- Red accent color.
- No emoji spam.
- No casual wording.
- Clear comparison between old and new version/build.
- Easy to read on mobile.
- Easy to scan during update days.

## Required Embed Fields

### Title

```txt
[Game Name] · update now live
```

Examples:

```txt
Counter-Strike 2 · update now live
Rust · update now live
Marvel Rivals · update now live
```

## Build Comparison

The embed must show the previous tracked build and the latest tracked build.

Preferred format:

```txt
Steam build changed:
22948122 → 22948967
```

If previous build is unknown:

```txt
Steam build changed:
Unknown → 22948967
```

If build ID is unavailable and news ID is used instead:

```txt
Steam update changed:
Previous news item → Latest news item
```

or:

```txt
Steam update changed:
Unknown → 2026-04-26 release notes
```

## Patch Notes Section

Use a clickable link.

```txt
Patch notes
Counter-Strike 2 release notes — 2026-04-26
```

The link should point to the Steam update/news/source page when available.

If no patch notes are available:

```txt
Patch notes
Steam update source unavailable
```

## What's New Section

Default wording:

```txt
A new Steam update is live for [Game Name]. Review the linked patch notes, compare changes against the previous tracked build, and verify product compatibility before marking this product as updated.
```

This wording should remain serious and operational.

Do not use phrases like:

- huge update dropped
- go check it out
- gamers rise up
- patch day hype
- fire update

## Footer

Footer should be generated from configured footer text plus date/time.

Default:

```txt
Astral Projects • Tracker • 2026-04-26 12:14 AM
```

The base footer text should come from:

```env
EMBED_FOOTER_TEXT=Astral Projects • Tracker
```

The time should be appended automatically using the configured timezone/date format.

## Author

Author values should be configurable.

```env
EMBED_AUTHOR_NAME=Astral
EMBED_AUTHOR_ICON_URL=
```

## Color

Default red:

```env
EMBED_COLOR=#ff2b4f
```

The embed color must be controlled by `.env`.

## Images

Each game should support a game-specific image/banner.

Config field:

```json
"imageUrl": ""
```

If no game image is configured, use:

```env
FALLBACK_IMAGE_URL=
```

If neither is configured, embed should still post without crashing.

## Full Example

```txt
Counter-Strike 2 · update now live

Steam build changed:
22948122 → 22948967

Patch notes
Counter-Strike 2 release notes — 2026-04-26

What's new
A new Steam update is live for Counter-Strike 2. Review the linked patch notes, compare changes against the previous tracked build, and verify product compatibility before marking this product as updated.

Footer:
Astral Projects • Tracker • 2026-04-26 12:14 AM
```
