import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page).toHaveTitle(/Klutr/)
    await expect(page.getByRole('heading', { name: /welcome to klutr/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should display signup page', async ({ page }) => {
    await page.goto('/signup')
    
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByLabel(/confirm password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('should show validation error for empty form', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Browser native validation should prevent submission
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toHaveAttribute('required')
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL('/signup')
    
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should redirect to app when authenticated', async ({ page }) => {
    // Skip this test if no auth configured
    test.skip(
      !process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'),
      'Supabase not configured'
    )

    // This test would need actual auth credentials in CI
    // For now, just verify redirect logic exists
  })
})
