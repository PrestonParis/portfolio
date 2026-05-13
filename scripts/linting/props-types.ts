import path from 'path';
import { readdir, readFile } from 'fs/promises';
import { pushIssue, isIgnoredPath } from './shared';

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    'out',
    'coverage',
]);

async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        if (entry.name.startsWith('.') && entry.name !== '.cursor') continue;
        if (IGNORE_DIRS.has(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const nested = await walk(fullPath);
            files.push(...nested);
            continue;
        }

        if (!entry.isFile() || !entry.name.endsWith('.tsx')) continue;
        files.push(fullPath);
    }

    return files;
}

function lineOf(content: string, index: number): number {
    return content.slice(0, index).split('\n').length;
}

export const runPropsTypeBoundaryCheck = async () => {
    const files = await walk(ROOT);

    for (const filePath of files) {
        if (filePath.includes('/types/')) continue;
        if (filePath.includes('/scripts/linting/')) continue;
        if (isIgnoredPath(filePath)) continue;

        const source = await readFile(filePath, 'utf8');

        const interfaceMatch = /^\s*interface\s+Props\b/m.exec(source);
        if (interfaceMatch && interfaceMatch.index !== undefined) {
            pushIssue({
                file: filePath,
                line: lineOf(source, interfaceMatch.index),
                type: 'PROPS_TYPE_LOCATION',
                severity: 'error',
                message:
                    "Do not declare `interface Props` in component files. Import Props from `@/types`.",
            });
        }

        const typeMatch = /^\s*type\s+Props\s*=/m.exec(source);
        if (typeMatch && typeMatch.index !== undefined) {
            pushIssue({
                file: filePath,
                line: lineOf(source, typeMatch.index),
                type: 'PROPS_TYPE_LOCATION',
                severity: 'error',
                message:
                    "Do not declare `type Props` in component files. Import Props from `@/types`.",
            });
        }

        const importRegex =
            /import\s+type\s*\{\s*[^}]*\bProps\b[^}]*\}\s+from\s+['"]([^'"]+)['"]/g;
        for (const match of source.matchAll(importRegex)) {
            const importSource = match[1];
            if (!importSource || importSource.startsWith('@/types')) continue;
            const idx = match.index ?? 0;
            pushIssue({
                file: filePath,
                line: lineOf(source, idx),
                type: 'PROPS_TYPE_LOCATION',
                severity: 'error',
                message: `Props must be imported from '@/types' (found "${importSource}").`,
            });
        }
    }
};
