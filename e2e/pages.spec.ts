import { test, expect } from '@playwright/test'

test('the published root opens the storefront with working styles, images, and video files', async ({ page, request }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('./')
  await expect(page).toHaveURL(/\/en\/$/)
  const brand = page.getByRole('link', { name: 'Sky Phone', exact: true })
  await expect(brand).toBeVisible()
  expect(await brand.evaluate((element) => getComputedStyle(element).fontFamily)).toContain('Bodoni')
  await expect(page.getByRole('heading', { name: 'iPhone Duo', exact: true })).toBeVisible()

  const brokenImages = await page.locator('img').evaluateAll(async (images) => {
    const results = await Promise.all(images.map(async (element) => {
      const image = element as HTMLImageElement
      image.loading = 'eager'
      try {
        await image.decode()
        return image.naturalWidth > 0 ? null : image.src
      } catch {
        return image.src
      }
    }))
    return results.filter(Boolean)
  })
  expect(brokenImages).toEqual([])
  for (const url of await page.locator('video').evaluateAll((videos) => (videos as HTMLVideoElement[]).flatMap((video) => [video.src, video.poster]))) {
    expect((await request.head(url)).ok(), url).toBe(true)
  }
  expect(errors).toEqual([])
})

test('brand filters work on direct loads, category changes, reload, and Back', async ({ page }) => {
  await page.goto('en/store/phones/?brand=apple')
  await expect(page.locator('h3').first()).toBeVisible()
  expect((await page.locator('h3').allTextContents()).every((name) => name.includes('iPhone'))).toBe(true)
  await page.getByRole('navigation', { name: 'Brand', exact: true }).getByRole('link', { name: 'Samsung', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Samsung')
  expect((await page.locator('h3').allTextContents()).every((name) => name.includes('Galaxy'))).toBe(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Samsung')
  await page.getByRole('navigation', { name: 'Category', exact: true }).getByRole('link', { name: 'Tablets', exact: true }).click()
  await expect(page).toHaveURL(/\/store\/tablets\/\?brand=samsung$/)
  await expect(page.locator('h3').first()).toContainText('Galaxy Tab')
  await page.goBack()
  await expect(page).toHaveURL(/\/store\/phones\/\?brand=samsung$/)
  await expect(page.locator('h3').first()).toContainText('Galaxy S')
})

test('search, product navigation, and the persistent shopping bag work without a server', async ({ page }) => {
  await page.goto('en/search/?q=Galaxy%20S25')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('“Galaxy S25”')
  await expect(page.locator('h3').first()).toBeVisible()
  expect((await page.locator('h3').allTextContents()).every((name) => name.includes('Galaxy S25'))).toBe(true)
  await page.locator('main a').filter({ has: page.getByRole('heading', { name: 'Galaxy S25', exact: true }) }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Galaxy S25')
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click()
  await page.goto('en/cart/')
  await expect(page.getByRole('heading', { name: 'Galaxy S25', exact: true })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Galaxy S25', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Send order on WhatsApp' })).toHaveAttribute('href', /wa\.me\/972527223916/)
})

test('Hebrew and Arabic pages keep their direction and language navigation', async ({ page }) => {
  await page.goto('he/about/')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('html')).toHaveAttribute('lang', 'he-IL')
  await page.locator('button[aria-controls="lang-menu"]').click()
  await page.locator('#lang-menu').getByRole('link', { name: 'العربية', exact: true }).click()
  await expect(page).toHaveURL(/\/ar\/about\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
})
