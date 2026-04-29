import { isTrackable } from '../config/games.js';
import { getBuildSnapshot, buildChanged } from '../steam/buildTracker.js';
import { getLatestPatchNotes, newsChanged } from '../steam/newsTracker.js';
import { buildUpdateEmbed } from '../discord/embedBuilder.js';
import { sendEmbed } from '../discord/webhookClient.js';
import { describeError } from '../utils/errors.js';
import { isoNow } from '../utils/time.js';
import { createLogger } from '../utils/logger.js';

export class TrackerService {
  constructor({ env, games, state }) {
    this.env = env;
    this.games = games;
    this.state = state;
    this.log = createLogger('tracker');
  }

  resolveWebhookUrl(game) {
    return game.webhookUrl || this.env.discord.webhookUrl;
  }

  resolveContent(game) {
    if (!this.env.flags.enableRolePings) return undefined;
    if (!game.roleMention) return undefined;
    return game.roleMention;
  }

  async checkGame(game, { force = false } = {}) {
    const log = createLogger(`game:${game.key}`);
    if (!isTrackable(game)) {
      log.debug('Skipping (disabled or unverified app id)');
      return { skipped: true };
    }

    const previous = this.state.get(game.key) ?? {};
    const result = {
      game: game.key,
      buildChanged: false,
      newsChanged: false,
      posted: false,
      error: null,
    };

    let buildSnap = null;
    let news = null;

    try {
      buildSnap = await getBuildSnapshot(game.steamAppId);
    } catch (err) {
      log.warn(`buildTracker error: ${describeError(err)}`);
    }

    try {
      news = await getLatestPatchNotes(game.steamAppId);
    } catch (err) {
      log.warn(`newsTracker error: ${describeError(err)}`);
    }

    const bChanged = buildChanged(previous, buildSnap);
    const nChanged = newsChanged(previous, news);
    result.buildChanged = bChanged;
    result.newsChanged = nChanged;

    const shouldPost = force || bChanged || (nChanged && !buildSnap?.buildId);

    if (!shouldPost) {
      log.debug(`No change. build=${buildSnap?.buildId ?? 'n/a'} newsGid=${news?.gid ?? 'n/a'}`);
      this.state.set(game.key, {
        ...previous,
        lastBuildId: buildSnap?.buildId ?? previous.lastBuildId ?? null,
        lastNewsGid: news?.gid ?? previous.lastNewsGid ?? null,
        lastPatchTitle: news?.title ?? previous.lastPatchTitle ?? null,
        lastPatchUrl: news?.url ?? previous.lastPatchUrl ?? null,
        lastCheckedAt: isoNow(),
      });
      return result;
    }

    const embed = buildUpdateEmbed({
      env: this.env,
      game,
      latest: { build: buildSnap, news },
      previous,
    });

    try {
      await sendEmbed({
        webhookUrl: this.resolveWebhookUrl(game),
        embed,
        content: this.resolveContent(game),
        allowedMentions: this.env.flags.enableRolePings
          ? { parse: ['roles'] }
          : { parse: [] },
      });
      result.posted = true;
      log.ok(
        `Posted update embed (build ${previous.lastBuildId ?? 'unknown'} → ${buildSnap?.buildId ?? 'n/a'})`,
      );
    } catch (err) {
      result.error = describeError(err);
      log.error(`Failed to deliver embed: ${result.error}`);
      return result;
    }

    this.state.set(game.key, {
      lastBuildId: buildSnap?.buildId ?? previous.lastBuildId ?? null,
      lastNewsGid: news?.gid ?? previous.lastNewsGid ?? null,
      lastPatchTitle: news?.title ?? previous.lastPatchTitle ?? null,
      lastPatchUrl: news?.url ?? previous.lastPatchUrl ?? null,
      lastCheckedAt: isoNow(),
      lastPostedAt: isoNow(),
    });
    return result;
  }

  async runOnce({ force = false } = {}) {
    this.log.info(`Polling ${this.games.length} game(s)…`);
    const results = [];
    for (const game of this.games) {
      try {
        results.push(await this.checkGame(game, { force }));
      } catch (err) {
        this.log.error(`Unhandled error for ${game.key}: ${describeError(err)}`);
        results.push({ game: game.key, error: describeError(err) });
      }
    }
    try {
      await this.state.save();
    } catch (err) {
      this.log.error(`Failed to persist state: ${describeError(err)}`);
    }
    const posted = results.filter((r) => r.posted).length;
    this.log.info(`Poll complete. posted=${posted} checked=${results.length}`);
    return results;
  }
}
