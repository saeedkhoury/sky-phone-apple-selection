import { test, expect, type Page } from '@playwright/test'

const heroSelector = 'section[aria-roledescription="carousel"][data-carousel-ready="true"]'

async function openHero(page: Page, locale = 'en') {
  await page.goto(`${locale}/`)
  await expect(page.locator(heroSelector)).toHaveCount(1)
}

async function expectSlide(page: Page, index: number) {
  const hero = page.locator(heroSelector)
  await expect(hero.locator('[data-hero-active="true"]')).toHaveAttribute('aria-label', `${index + 1} / 4`)
  await expect(hero.locator('button[aria-current="true"]')).toHaveCount(1)
  await expect.poll(() => hero.evaluate((element) => {
    const viewport = element.querySelector('div[class*="viewport"]')!.getBoundingClientRect()
    const card = element.querySelector('[data-hero-active="true"]')!.getBoundingClientRect()
    return Math.abs(card.left + card.width / 2 - viewport.left - viewport.width / 2)
  })).toBeLessThan(2)
}

async function freezeClock(page: Page) {
  await page.clock.install()
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1_000))
}

test('autoplay starts without any click, hover, or swipe', async ({ page }) => {
  await openHero(page)
  await expect(page.locator(`${heroSelector} [data-hero-active="true"]`)).toHaveAttribute(
    'aria-label', '2 / 4', { timeout: 10_000 },
  )
  await expectSlide(page, 1)
})

test('autoplay holds each slide for seven seconds and loops repeatedly, even while hovered', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openHero(page)
  await freezeClock(page)
  const hero = page.locator(heroSelector)
  await hero.getByRole('button', { name: 'iPhone Duo', exact: true }).click()
  await hero.locator('[data-hero-active="true"] img').hover()

  for (let step = 0; step < 8; step++) {
    await page.clock.runFor(6_999)
    await expectSlide(page, step % 4)
    await page.clock.runFor(1)
    await expectSlide(page, (step + 1) % 4)
  }
  await expect(hero.getByRole('button', { name: 'Pause slideshow' })).toHaveAttribute('aria-pressed', 'false')
})

test('animated autoplay keeps running after dot navigation, with pause and resume available', async ({ page }) => {
  await openHero(page)
  await freezeClock(page)
  const hero = page.locator(heroSelector)
  await hero.getByRole('button', { name: 'Repairs', exact: true }).click()
  await page.clock.runFor(2_000)
  await expectSlide(page, 3)
  // A full cycle through normal animated transitions, without more clicks.
  for (const index of [0, 1, 2, 3]) {
    await page.clock.runFor(8_000)
    await expectSlide(page, index)
  }

  await hero.getByRole('button', { name: 'Pause slideshow' }).click()
  await page.clock.runFor(22_000)
  await expectSlide(page, 3)
  await hero.getByRole('button', { name: 'Play slideshow' }).click()
  await page.clock.runFor(6_999)
  await expectSlide(page, 3)
  await page.clock.runFor(2_001)
  await expectSlide(page, 0)
})

for (const locale of ['en', 'he', 'ar']) {
  test(`horizontal scrolling loops forwards and backwards in ${locale}`, async ({ page }) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width: 1440, height: 900 })
    await openHero(page, locale)
    const hero = page.locator(heroSelector)
    // Pause only to isolate manual gestures from the independently tested timer.
    await hero.locator('button[aria-pressed]').click()
    const direction = locale === 'en' ? 1 : -1

    for (const forward of [true, false]) {
      for (let step = 1; step <= 8; step++) {
        const image = hero.locator('[data-hero-active="true"] img')
        await image.hover()
        await page.mouse.wheel(direction * (forward ? 850 : -850), 0)
        await expectSlide(page, (forward ? step : -step + 8) % 4)
      }
    }
    await expect(hero.locator('[aria-roledescription="slide"]')).toHaveCount(4)
    await expect(hero.locator('[aria-hidden="false"]')).toHaveCount(1)
  })
}

test.describe('touchscreen', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test('mobile swiping wraps both ways and resumes autoplay', async ({ page }) => {
    await openHero(page)
    const hero = page.locator(heroSelector)
    const image = hero.locator('[data-hero-active="true"] img')
    const touch = await page.context().newCDPSession(page)

    async function drag(fromX: number, toX: number) {
      const box = (await image.boundingBox())!
      const y = box.y + box.height / 2
      await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: fromX, y }] })
      for (let step = 1; step <= 20; step++) {
        await touch.send('Input.dispatchTouchEvent', {
          type: 'touchMove', touchPoints: [{ x: fromX + (toX - fromX) * step / 20, y }],
        })
      }
      await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    }

    await image.hover()
    await drag(80, 310)
    await expectSlide(page, 3)
    await drag(310, 80)
    await expectSlide(page, 0)
    await expect(hero.getByRole('button', { name: 'Pause slideshow' })).toHaveAttribute('aria-pressed', 'false')
    await expect(hero.locator('[data-hero-active="true"]')).toHaveAttribute('aria-label', '2 / 4', { timeout: 10_000 })
    await expectSlide(page, 1)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  })
})
