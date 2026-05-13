/**
 * scripts/linting/ts-errors.ts — TypeScript compiler diagnostics via tsc subprocess
 *
 * Runs `tsc --noEmit` out-of-process rather than loading the whole project into
 * a ts-morph Project. This avoids the multi-GB heap spike caused by loading
 * type declarations for heavy packages.
 */

import { execFileSync } from 'child_process';
import path from 'path';
import { pushIssue, isIgnoredPath } from './shared';

// tsc --pretty false emits lines like:
//   path/to/file.ts(10,5): error TS2345: Argument of type…
const DIAG_RE = /^(.+)\((\d+),\d+\): (error|warning) (TS\d+): (.+)$/;

export const runTsErrors = () => {
    let output = '';
    try {
        output = execFileSync(
            process.execPath, // node
            [
                require.resolve('typescript/bin/tsc'),
                '--noEmit',
                '--pretty',
                'false',
                '--noUnusedLocals',
                '--noUnusedParameters',
            ],
            {
                cwd: process.cwd(),
                encoding: 'utf-8',
                stdio: ['ignore', 'pipe', 'pipe'],
                env: { ...process.env, FORCE_COLOR: '0' },
            },
        );
    } catch (err: unknown) {
        const e = err as { stdout?: string; stderr?: string };
        output = (e.stdout ?? '') + (e.stderr ?? '');
    }

    const rootDir = process.cwd();

    for (const raw of output.split('\n')) {
        const line = raw.trim();
        const match = DIAG_RE.exec(line);
        if (!match) continue;

        const [, rawPath, lineStr, category, code, message] = match;
        if (!rawPath) continue;

        const absolutePath = path.isAbsolute(rawPath)
            ? rawPath
            : path.join(rootDir, rawPath);
        const relativePath = path.relative(rootDir, absolutePath);

        if (isIgnoredPath(relativePath)) continue;

        pushIssue({
            file: relativePath,
            line: Number(lineStr),
            type: 'TS_ERROR',
            severity: category === 'error' ? 'error' : 'warn',
            message: `${code}: ${message}`,
        });
    }
};
