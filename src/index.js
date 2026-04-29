import { loadEnv } from './config/env.js';
import { loadGames } from './config/games.js';
import { StateService } from './services/stateService.js';
import { TrackerService } from './services/trackerService.js';
import { sendEmbed } from './discord/webhookClient.js';
import { buildTestEmbed } from './discord/embedBuilder.js';
import { createLogger } from './utils/logger.js';
import { describeError } from './utils/errors.js';

const log = createLogger('main');

async function main() {
  const env = loadEnv();
  log.info(
    `Astral Steam Tracker starting. interval=${env.steam.pollIntervalMinutes}m timezone=${env.time.timezone}`,
  );

  const games = await loadGames(env.paths.gamesConfig);
  log.info(`Loaded ${games.length} game definition(s) from ${env.paths.gamesConfig}`);

  const state = new StateService(env.paths.stateFile);
  await state.load();
  log.debug(`State loaded from ${env.paths.stateFile}`);

  if (env.flags.enableStartupTest) {
    try {
      await sendEmbed({
        webhookUrl: env.discord.webhookUrl,
        embed: buildTestEmbed({ env }),
        allowedMentions: { parse: [] },
      });
      log.ok('Startup test embed delivered.');
    } catch (err) {
      log.error(`Startup test embed failed: ${describeError(err)}`);
    }
  }

  const tracker = new TrackerService({ env, games, state });

  await tracker.runOnce();

  const intervalMs = env.steam.pollIntervalMinutes * 60 * 1000;
  log.info(`Scheduling polling every ${env.steam.pollIntervalMinutes} minute(s).`);

  let running = false;
  const tick = async () => {
    if (running) {
      log.warn('Previous poll still in progress. Skipping this tick.');
      return;
    }
    running = true;
    try {
      await tracker.runOnce();
    } catch (err) {
      log.error(`Tick failed: ${describeError(err)}`);
    } finally {
      running = false;
    }
  };

  const timer = setInterval(tick, intervalMs);

  const shutdown = (signal) => {
    log.info(`Received ${signal}. Shutting down.`);
    clearInterval(timer);
    state.save().finally(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  log.error(`Fatal startup error: ${describeError(err)}`);
  process.exit(1);
});
