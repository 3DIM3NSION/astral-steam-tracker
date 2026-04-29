# Project Structure Plan

## Intended Final Structure

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

## Folder Responsibilities

### `config/`

Stores game configuration.

### `data/`

Stores local state for duplicate prevention.

### `src/config/`

Loads and validates environment variables.

### `src/steam/`

Handles Steam API/news/build logic.

### `src/discord/`

Handles webhook delivery and embed construction.

### `src/services/`

Coordinates tracker flow and state handling.

### `src/utils/`

Logging, time formatting, shared error helpers.

### `src/scripts/`

Manual operational tools such as force-check and test embed sending.
