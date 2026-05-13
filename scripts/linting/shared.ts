/**
 * analyze/shared.ts — Shared types, issue store, and output utilities
 */

export type Severity = 'error' | 'warn' | 'info';

export type IssueType =
    | 'TS_ERROR'
    | 'FAT_FILE'
    | 'INLINE_SVG'
    | 'DUPLICATE_API'
    | 'UNUSED_EXPORT'
    | 'HOOK_HEAVY'
    | 'TODO_FIXME'
    | 'LARGE_COMPONENT'
    | 'PROPS_TYPE_LOCATION'
    | 'LINT';

export type Issue = {
    file: string;
    line?: number;
    col?: number;
    type: IssueType;
    severity: Severity;
    message: string;
    /** Optional rule name, e.g. "react-hooks/rules-of-hooks" */
    rule?: string;
};

// ─── Global issue store (all sub-scripts push here) ───────────────────────────
export const allIssues: Issue[] = [];

export const pushIssue = (issue: Issue) => allIssues.push(issue);

// ─── Path helpers ─────────────────────────────────────────────────────────────
export const THIS_FILE = __filename;

export const isIgnoredPath = (filePath: string) =>
    filePath === THIS_FILE ||
    filePath.includes('/node_modules/') ||
    filePath.includes('node_modules/') ||
    filePath.includes('/.next/') ||
    filePath.includes('.next/') ||
    filePath.includes('/dist/') ||
    filePath.includes('dist/') ||
    filePath.includes('/build/') ||
    filePath.includes('build/') ||
    filePath.endsWith('.d.ts');

export const isIconFolder = (filePath: string) => filePath.includes('/icons/') || filePath.includes('/Icons/');

export const shortPath = (filePath: string) => {
    const cwd = process.cwd();
    return filePath.startsWith(cwd) ? filePath.slice(cwd.length + 1) : filePath;
};

// ─── Output ───────────────────────────────────────────────────────────────────
export const SEVERITY_ICON: Record<Severity, string> = {
    error: '🔴',
    warn:  '🟡',
    info:  '🔵',
};

const TYPE_LABEL: Record<IssueType, string> = {
    TS_ERROR:        'TypeScript Errors',
    FAT_FILE:        'Oversized Files',
    LARGE_COMPONENT: 'Oversized Functions / Components',
    HOOK_HEAVY:      'Hook-Heavy Components',
    INLINE_SVG:      'Inline SVGs',
    DUPLICATE_API:   'Direct API Calls (no service layer)',
    UNUSED_EXPORT:   'Possibly Unused Exports',
    TODO_FIXME:      'TODO / FIXME Comments',
    PROPS_TYPE_LOCATION: 'Props Type Location Violations',
    LINT:            'ESLint Violations',
};

const SEVERITY_ORDER: Severity[] = ['error', 'warn', 'info'];

export const printSummary = () => {
    const issues = allIssues;

    if (issues.length === 0) {
        console.log('\n✅  No issues detected\n');
        return;
    }

    // Group by type
    const grouped = issues.reduce<Record<string, Issue[]>>((acc, issue) => {
        const arr = acc[issue.type] ?? [];
        arr.push(issue);
        acc[issue.type] = arr;
        return acc;
    }, {});

    const sorted = Object.entries(grouped).sort(([, a], [, b]) => {
        return (
            SEVERITY_ORDER.indexOf(a[0]?.severity ?? 'warn') -
            SEVERITY_ORDER.indexOf(b[0]?.severity ?? 'warn')
        );
    });

    for (const [type, items] of sorted) {
        const label = TYPE_LABEL[type as IssueType] ?? type;
        console.log(`\n── ${label} (${items.length}) ──`);

        for (const issue of items) {
            const icon = SEVERITY_ICON[issue.severity];
            const loc  = [issue.line, issue.col].filter(Boolean).join(':');
            const ref  = loc ? `:${loc}` : '';
            const rule = issue.rule ? `  [${issue.rule}]` : '';
            console.log(`${icon}  ${shortPath(issue.file)}${ref}${rule}`);
            console.log(`   ${issue.message}`);
        }
    }

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warnCount  = issues.filter((i) => i.severity === 'warn').length;
    const infoCount  = issues.length - errorCount - warnCount;

    console.log('\n─────────────────────────────────────────────────');
    console.log(
        `Total: ${issues.length} issues  (🔴 ${errorCount} errors  🟡 ${warnCount} warnings  🔵 ${infoCount} info)`,
    );
    console.log('─────────────────────────────────────────────────\n');
};
