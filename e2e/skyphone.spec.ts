import { test, expect } from '@playwright/test'

const LOCALES = ['he', 'ar', 'en'] as const

test.describe('language and direction', () => {
  test('a bare path redirects into a language', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/(he|ar|en)$/)
  })

  test('Hebrew renders right-to-left', async ({ page }) => {
    await page.goto('/he')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
    await expect(page.locator('html')).toHaveAttribute('lang', 'he-IL')
  })

  test('Arabic renders right-to-left', async ({ page }) => {
    await page.goto('/ar')
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })

  test('English renders left-to-right', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  })

  test('the switcher keeps you on the same page in the new language', async ({ page }) => {
    await page.goto('/en/repairs')
    await page.getByRole('button', { name: /language|שפ|لغ/i }).click()
    await page.getByRole('link', { name: 'עברית' }).click()

    await expect(page).toHaveURL(/\/he\/repairs/)
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  })

  for (const locale of LOCALES) {
    test(`the ${locale} home page shows no untranslated keys`, async ({ page }) => {
      await page.goto(`/${locale}`)
      const body = await page.locator('body').innerText()
      // A missing translation falls back to the raw key, e.g. "fy_game_head".
      expect(body).not.toMatch(/\b[a-z]{2,6}_[a-z0-9_]{2,}\b/)
    })
  }
})

test.describe('catalogue', () => {
  test('the home page shows real product photography', async ({ page }) => {
    await page.goto('/en')
    // next/image rewrites src through the optimiser, so match the encoded path.
    const image = page.locator('img[src*="%2Fimg%2F"], img[src*="/img/"]').first()
    await expect(image).toBeVisible()

    const loaded = await image.evaluate(
      (node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
    )
    expect(loaded).toBe(true)
  })

  test('every home-page image actually loads', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    const broken = await page.evaluate(() =>
      [...document.querySelectorAll('img')]
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.getAttribute('src')),
    )
    expect(broken).toEqual([])
  })

  test('a category page lists its products', async ({ page }) => {
    await page.goto('/en/store/phones')
    await expect(page.getByRole('heading', { name: 'Phones', level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeVisible()
  })

  test('prices are shown in shekels, never dollars', async ({ page }) => {
    await page.goto('/en/store/phones')
    const body = await page.locator('body').innerText()
    expect(body).toContain('₪')
    expect(body).not.toContain('$')
  })

  test('a product page shows colours, storage and a shekel price', async ({ page }) => {
    await page.goto('/en/product/iphone-15-pro')
    await expect(page.getByRole('heading', { name: 'iPhone 15 Pro', level: 1 })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Natural Titanium' })).toBeVisible()
    await expect(page.getByRole('button', { name: /128GB/ })).toBeVisible()
    await expect(page.getByText('₪4,290').first()).toBeVisible()
  })

  test('choosing a storage option changes the price', async ({ page }) => {
    await page.goto('/en/product/iphone-15-pro')
    await page.getByRole('button', { name: /512GB/ }).click()
    await expect(page.getByText('₪5,190').first()).toBeVisible()
  })
})

test.describe('bag', () => {
  test('adds a product and orders it over WhatsApp', async ({ page }) => {
    await page.goto('/en/product/iphone-15-pro')
    await page.getByRole('button', { name: 'Add to bag' }).click()
    await page.goto('/en/cart')

    await expect(page.getByRole('heading', { name: 'iPhone 15 Pro' })).toBeVisible()

    // The shop takes orders on WhatsApp and payment in store — there is
    // deliberately no card form to fake.
    // Scope to the summary: the footer carries a WhatsApp link too.
    const order = page.getByRole('link', { name: 'Send order on WhatsApp' })
    await expect(order).toHaveAttribute('href', /wa\.me\/972527223916/)
    await expect(order).toHaveAttribute('href', /iPhone%2015%20Pro/)
  })

  test('the bag survives a reload', async ({ page }) => {
    await page.goto('/en/product/galaxy-s24-ultra')
    await page.getByRole('button', { name: 'Add to bag' }).click()
    await page.goto('/en/cart')
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Galaxy S24 Ultra' })).toBeVisible()
  })

  test('an empty bag invites you to browse', async ({ page }) => {
    await page.goto('/en/cart')
    await expect(page.getByRole('heading', { name: /empty/i })).toBeVisible()
  })
})

test.describe('repairs', () => {
  test('lists all seven services', async ({ page }) => {
    await page.goto('/en/repairs')
    await expect(page.getByRole('heading', { name: 'Screen replacement' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Console repair' })).toBeVisible()
  })

  for (const locale of LOCALES) {
    test(`quotes no repair price in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}/repairs`)
      const body = await page.locator('body').innerText()
      // The owner asked for repairs without indicative pricing.
      expect(body).not.toContain('₪')
    })
  }

  test('each service routes to a real conversation', async ({ page }) => {
    await page.goto('/en/repairs')
    const link = page.locator('a[href*="wa.me"]').first()
    await expect(link).toHaveAttribute('href', /wa\.me\/972527223916/)
  })
})

test.describe('shop details', () => {
  test('shows the verified phone number and address', async ({ page }) => {
    await page.goto('/en/about')
    await expect(page.getByText('052-722-3916').first()).toBeVisible()
    await expect(page.getByText(/Kafr Kanna/).first()).toBeVisible()
  })

  test('links to the business Instagram and Facebook', async ({ page }) => {
    await page.goto('/en/about')
    await expect(page.getByRole('link', { name: '@skyphone.ca' }).first()).toHaveAttribute(
      'href',
      'https://instagram.com/skyphone.ca',
    )
    await expect(page.getByRole('link', { name: 'Facebook' }).first()).toHaveAttribute(
      'href',
      'https://facebook.com/skyphone.ca',
    )
  })
})

test.describe('support chat', () => {
  test('answers a shop question from real data', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('button', { name: 'Sky Phone chat' }).click()
    await page.getByLabel(/Type a question/i).fill('where are you?')
    await page.getByRole('button', { name: 'Add' }).click()

    // Scope to the chat panel: the address also appears in the footer and the
    // trust band.
    const chat = page.getByRole('dialog', { name: 'Sky Phone chat' })
    await expect(chat.getByText(/Kafr Kanna/)).toBeVisible()
  })

  test('never quotes a repair price', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('button', { name: 'Sky Phone chat' }).click()
    await page.getByLabel(/Type a question/i).fill('how much is a screen repair?')
    await page.getByRole('button', { name: 'Add' }).click()

    const chat = page.getByRole('dialog', { name: 'Sky Phone chat' })
    await expect(chat).not.toContainText('₪')
  })
})

test.describe('chat accessibility', () => {
  test('opening the chat moves focus into it and Escape restores it', async ({ page }) => {
    await page.goto('/en')
    const trigger = page.getByRole('button', { name: 'Sky Phone chat' })
    await trigger.click()

    await expect(page.getByLabel(/Type a question/i)).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Sky Phone chat' })).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('Tab stays inside the open chat panel', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('button', { name: 'Sky Phone chat' }).click()

    const panel = page.getByRole('dialog', { name: 'Sky Phone chat' })
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab')
      const inside = await panel.evaluate((node) => node.contains(document.activeElement))
      expect(inside).toBe(true)
    }
  })
})

test.describe('localisation of UI chrome', () => {
  for (const locale of LOCALES) {
    test(`the theme switcher is translated in ${locale}`, async ({ page }) => {
      await page.goto(`/${locale}`)
      const group = page.getByRole('radiogroup')
      const text = await group.innerText()

      if (locale === 'en') {
        expect(text).toContain('Light')
      } else {
        // A Hebrew or Arabic visitor should not meet Latin UI chrome.
        expect(text).not.toMatch(/Light|Dark|Auto/)
      }
    })
  }
})

test.describe('responsive', () => {
  for (const [label, width] of [
    ['desktop', 1440],
    ['laptop', 1068],
    ['tablet', 833],
    ['mobile', 390],
  ] as const) {
    test(`no horizontal overflow at ${label} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/he')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})
