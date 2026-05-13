/**
 * analyze/stats.ts — Optional project stats (cloc + tree)
 *
 * Run via:  npm run check -- --stats
 *           npm run check -- --stats-only
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const IGNORE_DIRS = 'node_modules,.next,dist,build,out,.git';

// ─── Lines of Code ────────────────────────────────────────────────────────────
const countLinesOfCode = async (): Promise<void> => {
    let stdout = '';
    let stderr = '';

    try {
        ({ stdout, stderr } = await execAsync(
            `cloc . --exclude-dir=${IGNORE_DIRS} --include-ext=ts,tsx,js,jsx`,
        ));
    } catch (err: unknown) {
        const error = err as { stdout?: string; stderr?: string };
        stdout = error.stdout ?? '';
        stderr = error.stderr ?? '';
    }

    if (!stdout.trim()) {
        console.warn(
            '  ⚠️  cloc not found or returned no output.\n' +
            '     Install it: brew install cloc  (macOS) or apt install cloc  (Debian)',
        );
        if (stderr) console.warn('     stderr:', stderr.trim());
        return;
    }

    console.log('\n── Lines of Code (cloc) ──\n');
    console.log(stdout);
};

// ─── Directory Tree ───────────────────────────────────────────────────────────
const checkTree = async (): Promise<void> => {
    let stdout = '';
    let stderr = '';

    try {
        ({ stdout, stderr } = await execAsync(
            `tree -L 5 -I "${IGNORE_DIRS.replace(/,/g, '|')}"`,
        ));
    } catch (err: unknown) {
        const error = err as { stdout?: string; stderr?: string };
        stdout = error.stdout ?? '';
        stderr = error.stderr ?? '';
    }

    if (!stdout.trim()) {
        console.warn(
            '  ⚠️  tree not found or returned no output.\n' +
            '     Install it: brew install tree  (macOS) or apt install tree  (Debian)',
        );
        if (stderr) console.warn('     stderr:', stderr.trim());
        return;
    }

    console.log('\n── Directory Tree ──\n');
    console.log(stdout);
};

// ─── Exported runner ──────────────────────────────────────────────────────────
export const runStats = async (): Promise<void> => {
    await Promise.all([countLinesOfCode(), checkTree()]);
};
