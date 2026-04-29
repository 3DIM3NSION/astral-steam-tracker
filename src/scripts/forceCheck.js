import { loadEnv } from '../config/env.js';
import { loadGames } from '../config/games.js';
import { StateService } from '../services/stateService.js';
import { TrackerService } from '../services/trackerService.js';
import { createLogger } from '../utils/logger.js';
import { describeError } from '../utils/errors.js';

const log = createLogger('force-check');

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const onlyKey = args.find((a) => a.startsWith('--key='))?.split('=')[1];

  const env = loadEnv();
  let games = await loadGames(env.paths.gamesConfig);
  if (onlyKey) {
    games = games.filter((g) => g.key === onlyKey);
    if (games.length === 0) {
      log.error(`No game matched --key=${onlyKey}`);
      process.exit(1);
    }
  }

  const state = new StateService(env.paths.stateFile);
  await state.load();

  const tracker = new TrackerService({ env, games, state });
  const results = await tracker.runOnce({ force });

  for (const r of results) {
    log.info(JSON.stringify(r));
  }
  process.exit(0);
}

main().catch((err) => {
  log.error(`Force check failed: ${describeError(err)}`);
  process.exit(1);
});
