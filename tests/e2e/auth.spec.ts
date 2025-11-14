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

  test('should prevent form submission for empty fields', async ({ page }) => {
    await page.goto('/login')
    
    const emailInput = page.getByLabel(/email/i)
    await expect(emailInput).toHaveAttribute('required')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Verify form validation prevented submission
    const formValidity = await page.evaluate(() => {
      const form = document.querySelector('form')
      return form ? form.checkValidity() : true
    })
    expect(formValidity).toBe(false)
    
    // Verify we stayed on the login page
    await expect(page).toHaveURL('/login')
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page).toHaveURL('/signup')
    
    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should redirect to login when unauthenticated', async ({ page }) => {
    test.skip(
      !process.env.NEXT_PUBLIC_SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder'),
      'Supabase not configured'
    )

    // Verify that unauthenticated users are redirected to login
    await page.goto('/app')
    await expect(page).toHaveURL(/\/login/)
  })
})
