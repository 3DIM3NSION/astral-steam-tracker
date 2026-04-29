import { loadEnv } from '../config/env.js';
import { sendEmbed } from '../discord/webhookClient.js';
import { buildTestEmbed } from '../discord/embedBuilder.js';
import { createLogger } from '../utils/logger.js';
import { describeError } from '../utils/errors.js';

const log = createLogger('test-embed');

async function main() {
  const env = loadEnv();
  await sendEmbed({
    webhookUrl: env.discord.webhookUrl,
    embed: buildTestEmbed({ env }),
    allowedMentions: { parse: [] },
  });
  log.ok('Test embed delivered to configured webhook.');
}

main().catch((err) => {
  log.error(`Test embed failed: ${describeError(err)}`);
  process.exit(1);
});
