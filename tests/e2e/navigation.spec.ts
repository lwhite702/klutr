import { test, expect } from '@playwright/test'

test.describe('Public Pages Navigation', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Klutr/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should navigate to features page', async ({ page }) => {
    await page.goto('/')
    
    const featuresLink = page.getByRole('link', { name: /features/i }).first()
    await featuresLink.click()
    
    await expect(page).toHaveURL(/\/features/)
  })

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/')
    
    const pricingLink = page.getByRole('link', { name: /pricing/i }).first()
    await pricingLink.click()
    
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for nav element
    const nav = page.getByRole('navigation').first()
    await expect(nav).toBeVisible()
    
    // Check for skip link (accessibility)
    const skipLink = page.getByText(/skip to/i).first()
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveAttribute('href', /.+/)
    }
  })

  test('should load health check endpoint', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.ok()).toBeTruthy()
    
    const data = await response.json()
    expect(data).toHaveProperty('status')
  })
})
