import { runTsErrors } from './ts-errors';
import { runCodeSmells } from './code-smells';
import { runLint } from './lint';
import { runPropsTypeBoundaryCheck } from './props-types';
import { runStats } from './stats';
import { printSummary, allIssues } from './shared';

const args = new Set(process.argv.slice(2));

const only =
    args.has('--ts-only') ||
    args.has('--lint-only') ||
    args.has('--smells-only') ||
    args.has('--stats-only');

const run = {
    ts: !only || args.has('--ts-only'),
    smells: !only || args.has('--smells-only'),
    lint: !only || args.has('--lint-only'),
    stats: args.has('--stats') || args.has('--stats-only'),
};

void (async () => {
    console.log('\n🔍  CODEBASE ANALYSIS\n');

    if (run.ts) {
        console.log('── Running TypeScript diagnostics…');
        runTsErrors();
    }

    if (run.smells) {
        console.log('── Running code-smell checks…');
        runCodeSmells();
        console.log('── Running props type-location checks…');
        await runPropsTypeBoundaryCheck();
    }

    if (run.lint) {
        console.log('── Running ESLint checks…');
        await runLint();
    }

    if (run.stats) {
        console.log('── Running project stats…');
        await runStats();
    }

    printSummary();

    const errorCount = allIssues.filter((i) => i.severity === 'error').length;
    if (errorCount > 0) process.exit(1);
})();
