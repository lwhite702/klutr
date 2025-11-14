#!/usr/bin/env tsx
// @ts-nocheck
/**
 * Lighthouse accessibility audit script
 * 
 * Runs Lighthouse audits on key routes and generates reports.
 * 
 * Usage:
 *   pnpm a11y:lighthouse
 * 
 * Requires the dev server to be running on http://localhost:3000
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Note: These imports require the packages to be installed
// Run: pnpm add -D lighthouse chrome-launcher
// The audit script will work once dependencies are installed

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const REPORTS_DIR = join(process.cwd(), 'reports', 'accessibility')

// Routes to audit
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/pricing', name: 'pricing' },
  { path: '/app', name: 'app' },
  { path: '/app/chat', name: 'app-chat' },
  { path: '/app/mindstorm', name: 'app-mindstorm' },
  { path: '/app/stacks', name: 'app-stacks' },
  { path: '/app/vault', name: 'app-vault' },
]

async function auditRoute(path: string, name: string) {
  console.log(`Auditing ${path} with Lighthouse...`)
  
  // Dynamic imports to handle missing dependencies gracefully
  const lighthouse = (await import('lighthouse')).default
  const chromeLauncher = await import('chrome-launcher') as any
  
  const chrome = await chromeLauncher.default.launch({ chromeFlags: ['--headless'] })
  const options: any = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['accessibility'],
    port: chrome.port,
  }
  
  try {
    const runnerResult = await lighthouse(`${BASE_URL}${path}`, options)
    
    // Save JSON report
    const jsonPath = join(REPORTS_DIR, `${name}-lighthouse.json`)
    writeFileSync(jsonPath, JSON.stringify(runnerResult?.lhr, null, 2))
    console.log(`  ✓ Saved JSON report: ${jsonPath}`)
    
    // Save HTML report
    const htmlPath = join(REPORTS_DIR, `${name}-lighthouse.html`)
    const reportContent = runnerResult?.report
    writeFileSync(htmlPath, Array.isArray(reportContent) ? reportContent.join('') : (reportContent || ''))
    console.log(`  ✓ Saved HTML report: ${htmlPath}`)
    
    // Log accessibility score
    const a11yScore = runnerResult?.lhr?.categories?.accessibility?.score
    if (a11yScore !== undefined && a11yScore !== null) {
      const scorePercent = Math.round(a11yScore * 100)
      console.log(`  Accessibility score: ${scorePercent}/100`)
    }
    
    await chrome.kill()
  } catch (error: any) {
    console.error(`  ✗ Error auditing ${path}:`, error.message)
    await chrome.kill()
    throw error
  }
}

async function main() {
  console.log('Starting Lighthouse accessibility audit...\n')
  console.log(`Base URL: ${BASE_URL}\n`)
  
  // Ensure reports directory exists
  mkdirSync(REPORTS_DIR, { recursive: true })
  
  for (const route of ROUTES) {
    try {
      await auditRoute(route.path, route.name)
    } catch (error) {
      console.error(`Failed to audit ${route.path}`)
    }
  }
  
  console.log('\n✓ Lighthouse audit complete')
}

main().catch(console.error)

