import path from 'path';
import { readdir } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { pushIssue, isIgnoredPath, type Severity } from './shared';

// Rules that should be treated as errors regardless of your ESLint config level.
const FORCE_ERROR_RULES = new Set([
    'react-hooks/rules-of-hooks',
]);

// Rules where we want to surface additional context in the message.
const KNOWN_RULE_HINTS: Record<string, string> = {
    'react-hooks/exhaustive-deps':
        'Missing or extra dependency in useEffect/useCallback — see https://react.dev/learn/removing-effect-dependencies',
};

const LINT_EXTENSIONS = new Set(['.ts', '.tsx']);
const IGNORE_DIRS = new Set([
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    'out',
    'coverage',
]);
const ESLINT_BATCH_SIZE = 80;
const execFileAsync = promisify(execFile);

type EslintMessage = {
    ruleId: string | null;
    severity: 0 | 1 | 2;
    message: string;
    line?: number;
    column?: number;
};

type EslintResult = {
    filePath: string;
    messages: EslintMessage[];
};

/**
 * Map ESLint severity numbers to our Severity type.
 * ESLint: 0 = off, 1 = warn, 2 = error
 */
const eslintSeverity = (n: 0 | 1 | 2, rule: string): Severity => {
    if (FORCE_ERROR_RULES.has(rule)) return 'error';
    return n === 2 ? 'error' : 'warn';
};

const collectLintFiles = async (dir: string): Promise<string[]> => {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.cursor') continue;
        if (IGNORE_DIRS.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            files.push(...(await collectLintFiles(fullPath)));
            continue;
        }

        if (!entry.isFile()) continue;
        if (!LINT_EXTENSIONS.has(path.extname(entry.name))) continue;
        if (isIgnoredPath(fullPath)) continue;

        files.push(fullPath);
    }

    return files;
};

const runEslintBatch = async (
    root: string,
    batch: string[],
): Promise<EslintResult[] | null> => {
    const eslintBin = path.join(root, 'node_modules/eslint/bin/eslint.js');
    const args = [
        eslintBin,
        '--format',
        'json',
        '--no-error-on-unmatched-pattern',
        '--cache',
        '--cache-location',
        path.join(root, '.cache/eslint/.eslintcache'),
        ...batch,
    ];

    try {
        const { stdout } = await execFileAsync(process.execPath, args, {
            cwd: root,
            maxBuffer: 50 * 1024 * 1024,
            env: {
                ...process.env,
                NODE_OPTIONS: '--max-old-space-size=3072',
            },
        });
        return JSON.parse(stdout) as EslintResult[];
    } catch (err: unknown) {
        const e = err as {
            code?: number;
            stdout?: string;
            stderr?: string;
        };

        // eslint exits 1 when lint errors exist; stdout still contains JSON.
        if (typeof e.stdout === 'string' && e.stdout.trim()) {
            try {
                return JSON.parse(e.stdout) as EslintResult[];
            } catch {
                console.warn('  ⚠️  ESLint output could not be parsed.');
                if (e.stderr) console.warn(e.stderr);
                return null;
            }
        }

        console.warn('  ⚠️  ESLint batch failed to run.');
        if (e.stderr) console.warn(e.stderr);
        return null;
    }
};

export const runLint = async () => {
    const root = process.cwd();
    const lintFiles = await collectLintFiles(root);

    for (let i = 0; i < lintFiles.length; i += ESLINT_BATCH_SIZE) {
        const batch = lintFiles.slice(i, i + ESLINT_BATCH_SIZE);
        const batchResults = await runEslintBatch(root, batch);
        if (!batchResults) return;

        for (const result of batchResults) {
            const filePath = result.filePath;
            if (isIgnoredPath(filePath)) continue;

            for (const msg of result.messages) {
                const rule = msg.ruleId ?? 'unknown';
                const hint = KNOWN_RULE_HINTS[rule];
                const baseMsg = msg.message;
                const fullMsg = hint ? `${baseMsg}\n     💡 ${hint}` : baseMsg;

                pushIssue({
                    file: filePath,
                    ...(msg.line !== undefined && { line: msg.line }),
                    ...(msg.column !== undefined && { col: msg.column }),
                    type: 'LINT',
                    severity: eslintSeverity(msg.severity, rule),
                    message: fullMsg,
                    rule,
                });
            }
        }
    }
};
