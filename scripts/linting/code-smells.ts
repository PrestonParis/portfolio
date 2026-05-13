/**
 * analyze/code-smells.ts — AST-based code smell detection via ts-morph
 *
 * Catches:
 *  - FAT_FILE        : files with too many lines or exports
 *  - LARGE_COMPONENT : individual functions/components over 100 lines
 *  - HOOK_HEAVY      : components with too many hook calls
 *  - INLINE_SVG      : <svg> outside an icon folder
 *  - DUPLICATE_API   : raw fetch('/api/…') calls in components
 *  - TODO_FIXME      : TODO / FIXME / HACK / XXX comments
 */

import { Project, SyntaxKind } from 'ts-morph';
import { pushIssue, isIgnoredPath, isIconFolder } from './shared';

const LINE_LIMIT        = 300;
const EXPORT_LIMIT      = 12;
const HOOK_LIMIT        = 6;
const FN_LINE_LIMIT     = 100;

export const runCodeSmells = () => {
    const project = new Project({
        tsConfigFilePath: 'tsconfig.json',
        skipAddingFilesFromTsConfig: false,
    });

    project.getSourceFiles().forEach((file) => {
        const filePath = file.getFilePath();

        // Skip if it's in the ignored list OR if it's within the linting directory
        if (isIgnoredPath(filePath) || filePath.includes('/scripts/linting/')) {
            return;
        }

        const text      = file.getFullText();
        const lines     = text.split('\n');
        const lineCount = lines.length;

        // ── FAT FILE ──────────────────────────────────────────────────────────
        const exportCount = file.getExportedDeclarations().size;
        const fatReasons: string[] = [];

        if (lineCount > LINE_LIMIT)
            fatReasons.push(`${lineCount} lines (limit: ${LINE_LIMIT})`);
        if (exportCount > EXPORT_LIMIT)
            fatReasons.push(`${exportCount} exports (limit: ${EXPORT_LIMIT})`);

        if (fatReasons.length > 0) {
            pushIssue({
                file: filePath,
                type: 'FAT_FILE',
                severity: 'warn',
                message: `File is too large: ${fatReasons.join(', ')}`,
            });
        }

        // ── HOOK-HEAVY COMPONENTS ─────────────────────────────────────────────
        // Only applies to .tsx files outside /hooks/
        if (filePath.endsWith('.tsx') && !filePath.includes('/hooks/')) {
            const hookCalls = file
                .getDescendantsOfKind(SyntaxKind.CallExpression)
                .filter((c) => /^use[A-Z]/.test(c.getExpression().getText()));

            if (hookCalls.length > HOOK_LIMIT) {
                pushIssue({
                    file: filePath,
                    type: 'HOOK_HEAVY',
                    severity: 'warn',
                    message: `${hookCalls.length} hook calls — extract logic into a custom hook (limit: ${HOOK_LIMIT})`,
                });
            }
        }

        // ── LARGE FUNCTIONS / COMPONENTS ──────────────────────────────────────
        const functions = [
            ...file.getDescendantsOfKind(SyntaxKind.FunctionDeclaration),
            ...file.getDescendantsOfKind(SyntaxKind.ArrowFunction),
        ];

        functions.forEach((fn) => {
            const start  = fn.getStartLineNumber();
            const end    = fn.getEndLineNumber();
            const fnLines = end - start;

            if (fnLines <= FN_LINE_LIMIT) return;

            const name =
                'getName' in fn && typeof fn.getName === 'function'
                    ? (fn.getName() ?? '<anonymous>')
                    : (fn.getParent()?.getSymbol()?.getName() ?? '<anonymous>');

            pushIssue({
                file: filePath,
                line: start,
                type: 'LARGE_COMPONENT',
                severity: 'warn',
                message: `"${name}" is ${fnLines} lines (limit: ${FN_LINE_LIMIT}) — consider splitting`,
            });
        });

        // ── INLINE SVG ────────────────────────────────────────────────────────
        if (text.includes('<svg') && !isIconFolder(filePath)) {
            const svgLine = lines.findIndex((l) => l.includes('<svg')) + 1;
            pushIssue({
                file: filePath,
                line: svgLine,
                type: 'INLINE_SVG',
                severity: 'info',
                message: 'Inline <svg> found outside /icons — move to an icon component',
            });
        }

        // ── DIRECT API ROUTE CALLS ────────────────────────────────────────────
        const fetchMatches = text.matchAll(/fetch\(['"`](\/api\/[^'"`]+)['"`]/g);
        for (const match of fetchMatches) {
            const apiPath = match[1];
            const callLine = text.slice(0, match.index).split('\n').length;
            pushIssue({
                file: filePath,
                line: callLine,
                type: 'DUPLICATE_API',
                severity: 'warn',
                message: `Direct fetch("${apiPath}") — centralise in an API service module`,
            });
        }

        // ── TODO / FIXME COMMENTS ─────────────────────────────────────────────
        lines.forEach((line, i) => {
            const match = line.match(/^\s*\/\/\s*(TODO|FIXME|HACK|XXX)/i);
            if (match) {
                pushIssue({
                    file: filePath,
                    line: i + 1,
                    type: 'TODO_FIXME',
                    severity: 'info',
                    message: match[0].trim(),
                });
            }
        });
    });
};
