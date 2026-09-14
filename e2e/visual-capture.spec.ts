import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test, expect } from '@playwright/test'

const outputDirectory = process.env.SHOT_DIR ? resolve(process.env.SHOT_DIR) : null

// This is an opt-in capture helper, not a CI visual-diff suite. Run it with
// SHOT_DIR=artifacts/visual npx playwright test e2e/visual-capture.spec.ts.
test.skip(!outputDirectory, 'Set SHOT_DIR to generate manual visual captures.')

test.beforeAll(async () => {
  await mkdir(outputDirectory!, { recursive: true })
})

async function settle(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle')
  await expect
    .poll(async () =>
      page.evaluate(() =>
        [...document.querySelectorAll('img')].every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true)
}

test('captures the repairs hero', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/en')
  await page.getByRole('button', { name: 'Repairs', exact: true }).click()
  await settle(page)
  await page.screenshot({ path: `${outputDirectory}/repairs-hero.png` })
})

test('captures the Apple-filtered catalog', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/en/store/all?brand=apple')
  await settle(page)
  await page.screenshot({ path: `${outputDirectory}/apple-filtered-catalog.png`, fullPage: true })
})

test('captures the Hebrew home page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/he')
  await settle(page)
  await page.screenshot({ path: `${outputDirectory}/hebrew-home.png` })
})
