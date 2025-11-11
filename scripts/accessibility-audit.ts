#!/usr/bin/env tsx
/**
 * Accessibility audit script using axe-core
 * 
 * Runs WCAG 2.1 AA-level checks on key routes and generates reports.
 * 
 * Usage:
 *   pnpm a11y:audit
 * 
 * Requires the dev server to be running on http://localhost:3000
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Note: These imports require the packages to be installed
// Run: pnpm add -D axios jsdom axe-core
// The audit script will work once dependencies are installed

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const REPORTS_DIR = join(process.cwd(), 'reports', 'accessibility')

// Routes to audit
const ROUTES = [
  // Marketing pages
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/pricing', name: 'pricing' },
  // App pages
  { path: '/app', name: 'app' },
  { path: '/app/chat', name: 'app-chat' },
  { path: '/app/mindstorm', name: 'app-mindstorm' },
  { path: '/app/stacks', name: 'app-stacks' },
  { path: '/app/vault', name: 'app-vault' },
]

interface AuditResult {
  route: string
  violations: any[]
  passes: any[]
  incomplete: any[]
  timestamp: string
}

async function auditRoute(path: string, name: string): Promise<AuditResult> {
  console.log(`Auditing ${path}...`)
  
  try {
    // Dynamic imports to handle missing dependencies gracefully
    const axios = (await import('axios')).default
    const { JSDOM } = await import('jsdom')
    const axe = await import('axe-core')
    
    // Fetch the page
    const response = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AccessibilityAudit/1.0)',
      },
    })
    
    // Parse HTML
    const dom = new JSDOM(response.data)
    const document = dom.window.document
    
    // Run axe-core
    const results = await axe.default.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
      rules: {
        'color-contrast': { enabled: true },
        'focus-order-semantics': { enabled: true },
        'keyboard-navigation': { enabled: true },
      },
    })
    
    const auditResult: AuditResult = {
      route: path,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      timestamp: new Date().toISOString(),
    }
    
    // Save JSON report
    const jsonPath = join(REPORTS_DIR, `${name}-axe.json`)
    writeFileSync(jsonPath, JSON.stringify(auditResult, null, 2))
    console.log(`  ✓ Saved JSON report: ${jsonPath}`)
    
    // Generate HTML report
    const htmlReport = generateHTMLReport(auditResult)
    const htmlPath = join(REPORTS_DIR, `${name}-axe.html`)
    writeFileSync(htmlPath, htmlReport)
    console.log(`  ✓ Saved HTML report: ${htmlPath}`)
    
    // Log summary
    const violationCount = results.violations.length
    if (violationCount > 0) {
      console.log(`  ⚠️  Found ${violationCount} violation(s)`)
    } else {
      console.log(`  ✓ No violations found`)
    }
    
    return auditResult
  } catch (error: any) {
    console.error(`  ✗ Error auditing ${path}:`, error.message)
    throw error
  }
}

function generateHTMLReport(result: AuditResult): string {
  const violationsHTML = result.violations.map(v => `
    <div class="violation">
      <h3>${v.id}: ${v.help}</h3>
      <p><strong>Impact:</strong> ${v.impact}</p>
      <p><strong>Description:</strong> ${v.description}</p>
      <p><strong>Help URL:</strong> <a href="${v.helpUrl}" target="_blank">${v.helpUrl}</a></p>
      <details>
        <summary>Affected Elements (${v.nodes.length})</summary>
        <ul>
          ${v.nodes.map(node => `<li><code>${node.html}</code></li>`).join('')}
        </ul>
      </details>
    </div>
  `).join('')
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Audit: ${result.route}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .violation { background: #fee; border-left: 4px solid #c33; padding: 1rem; margin: 1rem 0; }
    .summary { background: #efe; padding: 1rem; margin: 1rem 0; border-radius: 4px; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
    details { margin-top: 0.5rem; }
    ul { margin: 0.5rem 0; }
  </style>
</head>
<body>
  <h1>Accessibility Audit Report</h1>
  <div class="summary">
    <p><strong>Route:</strong> ${result.route}</p>
    <p><strong>Timestamp:</strong> ${result.timestamp}</p>
    <p><strong>Violations:</strong> ${result.violations.length}</p>
    <p><strong>Passes:</strong> ${result.passes.length}</p>
    <p><strong>Incomplete:</strong> ${result.incomplete.length}</p>
  </div>
  ${result.violations.length > 0 ? `<h2>Violations</h2>${violationsHTML}` : '<h2>✓ No violations found</h2>'}
</body>
</html>`
}

async function main() {
  console.log('Starting accessibility audit...\n')
  console.log(`Base URL: ${BASE_URL}\n`)
  
  // Ensure reports directory exists
  mkdirSync(REPORTS_DIR, { recursive: true })
  
  const results: AuditResult[] = []
  
  for (const route of ROUTES) {
    try {
      const result = await auditRoute(route.path, route.name)
      results.push(result)
    } catch (error) {
      console.error(`Failed to audit ${route.path}`)
    }
  }
  
  // Generate summary report
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0)
  const summary = {
    timestamp: new Date().toISOString(),
    totalRoutes: ROUTES.length,
    totalViolations,
    routes: results.map(r => ({
      route: r.route,
      violations: r.violations.length,
      passes: r.passes.length,
    })),
  }
  
  const summaryPath = join(REPORTS_DIR, 'summary.json')
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
  console.log(`\n✓ Summary report: ${summaryPath}`)
  console.log(`\nTotal violations: ${totalViolations}`)
  
  if (totalViolations > 0) {
    process.exit(1)
  }
}

main().catch(console.error)

