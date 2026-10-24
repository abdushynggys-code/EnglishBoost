// Planning model, not measured learner behaviour. Run: node scripts/check-economy.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, file);
const { sparkTiers } = require('../src/data/streakSparks.ts');
const { buildLearningPath } = require('../src/data/course/units.ts');
const path = buildLearningPath('A1', 'everyday', 'balance').flatMap(unit => unit.lessons);
function simulate(sessionsPerDay) {
  let xp = 0, coins = 0, session = 0, nextTier = 1;
  const milestones = [];
  for (let day = 1; day <= 1000 && nextTier < sparkTiers.length; day++) {
    for (let slot = 0; slot < sessionsPerDay && nextTier < sparkTiers.length; slot++) {
      const lesson = path[session];
      const base = lesson ? (lesson.kind === 'checkpoint' ? 250 : 100) : (slot === 0 ? 150 : 50);
      // Passed sessions; one perfect score in four, consecutive study days, no speed bonus.
      const streak = Math.min(20, day);
      const earned = base + Math.min(20, streak * 2) + (session % 4 === 3 ? 20 : 0);
      xp += earned;
      coins += Math.max(1, Math.floor(earned / 10)) + Math.min(5, Math.floor(streak / 3));
      session++;
      while (nextTier < sparkTiers.length && xp >= sparkTiers[nextTier].xp) {
        const tier = sparkTiers[nextTier];
        assert.ok(coins >= tier.price, `Cannot afford a base Spark at tier ${nextTier + 1}`);
        coins -= tier.price; // Buy one base Spark in every unlocked tier; keep optional variants as goals.
        milestones.push({ tier: ++nextTier, day, sessions: session, coinsLeft: coins });
      }
    }
  }
  assert.equal(nextTier, 11);
  assert.ok(milestones[0].sessions >= 3 && milestones[0].sessions <= 5, 'First unlock should arrive within a few sessions');
  assert.ok(milestones[9].day > milestones[8].day, 'Unknown needs a distinct endgame goal');
  return { sessionsPerDay, milestones };
}
const scenarios = [simulate(1), simulate(2)];
assert.ok(scenarios[0].milestones[9].day < 550, 'Daily learners should have a reachable long-term goal');
assert.ok(scenarios[1].milestones[9].day >= 180, 'Two daily sessions should not trivialise Unknown');
console.log(JSON.stringify({ assumptions: 'Daily passed study, one perfect in four, no speed bonuses; all six course levels then daily challenge/review.', scenarios }, null, 2));
