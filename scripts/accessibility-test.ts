#!/usr/bin/env tsx
/**
 * Combined accessibility test script
 * 
 * Runs both Lighthouse and axe-core audits on key routes and generates reports.
 * Exits with error code if accessibility score < 90.
 * 
 * Usage:
 *   pnpm test:accessibility
 * 
 * Requires the dev server to be running on http://localhost:3000
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const REPORTS_DIR = join(process.cwd(), 'reports', 'accessibility')
const MIN_SCORE = 90

// Routes to audit
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/pricing', name: 'pricing' },
  { path: '/features', name: 'features' },
  { path: '/faq', name: 'faq' },
  { path: '/help', name: 'help' },
  { path: '/onboarding', name: 'onboarding' },
]

interface TestResult {
  route: string
  lighthouseScore: number | null
  axeViolations: number
  passed: boolean
}

async function runLighthouseAudit(path: string): Promise<number | null> {
  try {
    const lighthouse = (await import('lighthouse')).default
    const chromeLauncher = await import('chrome-launcher')
    
    const chrome = await chromeLauncher.default.launch({ chromeFlags: ['--headless'] })
    const options = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['accessibility'] as const,
      port: chrome.port,
    }
    
    const runnerResult = await lighthouse(`${BASE_URL}${path}`, options)
    await chrome.kill()
    
    if (runnerResult?.lhr?.categories?.accessibility?.score !== undefined) {
      const score = Math.round((runnerResult.lhr.categories.accessibility.score || 0) * 100)
      return score
    }
    return null
  } catch (error) {
    console.error(`Lighthouse audit failed for ${path}:`, error)
    return null
  }
}

async function runAxeAudit(path: string): Promise<number> {
  try {
    const axios = (await import('axios')).default
    const { JSDOM } = await import('jsdom')
    const axe = (await import('axe-core')).default
    
    const response = await axios.get(`${BASE_URL}${path}`)
    const dom = new JSDOM(response.data)
    const window = dom.window
    const document = window.document
    
    // Inject axe-core into the virtual DOM
    window.eval(axe.source)
    
    const results = await (window as any).axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
    })
    
    return results.violations.length
  } catch (error) {
    console.error(`Axe audit failed for ${path}:`, error)
    return 0
  }
}

async function testRoute(path: string, name: string): Promise<TestResult> {
  console.log(`\nTesting ${path}...`)
  
  const lighthouseScore = await runLighthouseAudit(path)
  const axeViolations = await runAxeAudit(path)
  
  const passed = (lighthouseScore === null || lighthouseScore >= MIN_SCORE) && axeViolations === 0
  
  console.log(`  Lighthouse score: ${lighthouseScore ?? 'N/A'}`)
  console.log(`  Axe violations: ${axeViolations}`)
  console.log(`  Status: ${passed ? 'PASS' : 'FAIL'}`)
  
  return {
    route: path,
    lighthouseScore,
    axeViolations,
    passed,
  }
}

async function main() {
  console.log('Running combined accessibility tests...')
  console.log(`Testing routes on ${BASE_URL}`)
  console.log(`Minimum Lighthouse score: ${MIN_SCORE}`)
  
  // Ensure reports directory exists
  mkdirSync(REPORTS_DIR, { recursive: true })
  
  const results: TestResult[] = []
  
  for (const route of ROUTES) {
    const result = await testRoute(route.path, route.name)
    results.push(result)
  }
  
  // Generate summary report
  const summary = {
    timestamp: new Date().toISOString(),
    totalRoutes: ROUTES.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    results,
  }
  
  const reportPath = join(REPORTS_DIR, 'accessibility-test-summary.json')
  writeFileSync(reportPath, JSON.stringify(summary, null, 2))
  
  console.log('\n=== Test Summary ===')
  console.log(`Total routes: ${summary.totalRoutes}`)
  console.log(`Passed: ${summary.passed}`)
  console.log(`Failed: ${summary.failed}`)
  console.log(`\nFull report saved to: ${reportPath}`)
  
  // Exit with error code if any tests failed
  if (summary.failed > 0) {
    console.error('\n❌ Some accessibility tests failed. Please review the report.')
    process.exit(1)
  } else {
    console.log('\n✅ All accessibility tests passed!')
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

