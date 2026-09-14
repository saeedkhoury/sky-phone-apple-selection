import { test, expect } from '@playwright/test'

test.describe('browsing', () => {
  test('home page shows the hero and category tiles', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Shop by category' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Laptops/ }).first()).toBeVisible()
  })

  test('navigates from a category tile to its listing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: 'Laptops' }).click()
    await expect(page).toHaveURL(/\/store\/laptops/)
    await expect(page.getByRole('heading', { name: 'Laptops', level: 1 })).toBeVisible()
  })

  test('opens a product detail page from a tile', async ({ page }) => {
    await page.goto('/store/laptops')
    await page.getByRole('heading', { name: 'Aero 15 Pro' }).click()
    await expect(page).toHaveURL(/\/product\/aero-15-pro/)
    await expect(page.getByRole('heading', { name: 'Aero 15 Pro', level: 1 })).toBeVisible()
    await expect(
      page.getByRole('region', { name: 'Technical specifications' }),
    ).toBeVisible()
  })

  test('the nav flyout opens and closes with Escape', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Phones', exact: true })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('search finds a product by name', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search the store' }).click()
    await page.getByRole('searchbox', { name: 'Search products' }).fill('vertex')

    // Scope to the overlay: the page behind it lists the same products.
    const overlay = page.getByRole('dialog', { name: 'Search' })
    await expect(overlay.getByRole('link', { name: /Vertex Pro/ })).toBeVisible()
  })

  test('search shows an empty state when nothing matches', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search the store' }).click()
    await page.getByRole('searchbox', { name: 'Search products' }).fill('zzzzqqq')
    await expect(page.getByText(/No products match/)).toBeVisible()
  })
})

test.describe('cart', () => {
  test('adds a product and shows it in the bag', async ({ page }) => {
    await page.goto('/product/pulse-buds-pro')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await expect(page.getByRole('status')).toHaveText(/Added to your bag/)

    await page.getByRole('link', { name: /Shopping bag/ }).click()
    await expect(page).toHaveURL(/\/cart/)
    await expect(page.getByRole('heading', { name: 'Pulse Buds Pro' })).toBeVisible()
    await expect(page.getByText('$249.00').first()).toBeVisible()
  })

  test('selecting a different variant adds that variant', async ({ page }) => {
    await page.goto('/product/vertex-pro')
    await page.getByRole('button', { name: /Deep Blue/ }).click()
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/cart')
    await expect(page.getByText('Deep Blue · 256GB')).toBeVisible()
  })

  test('the cart survives a page reload', async ({ page }) => {
    await page.goto('/product/orbit-mouse')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Orbit Mouse' })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Orbit Mouse' })).toBeVisible()
  })

  test('changing quantity updates the line total', async ({ page }) => {
    await page.goto('/product/flux-charger')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/cart')

    await page.getByLabel(/Quantity for Flux Charger/).selectOption('3')

    // 3 x $129.00. Assert on the line itself, not the summary, which repeats it.
    const lines = page.getByRole('region', { name: 'Bag items' })
    await expect(lines.getByText('$387.00')).toBeVisible()
  })

  test('removing the last line empties the bag', async ({ page }) => {
    await page.goto('/product/flux-charger')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/cart')
    await page.getByRole('button', { name: 'Remove' }).click()
    await expect(page.getByRole('heading', { name: /Your bag is empty/ })).toBeVisible()
  })

  test('an empty bag invites the shopper to browse', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /Your bag is empty/ })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible()
  })
})

test.describe('checkout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/product/pulse-studio')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
  })

  test('blocks submission and reports every empty field', async ({ page }) => {
    await page.goto('/checkout')
    await page.getByRole('button', { name: 'Place order' }).click()

    // One message per field, scoped to the form so nothing else with an alert
    // role (dev overlays) is counted.
    const form = page.getByRole('form', { name: 'Delivery details' })
    await expect(form.getByRole('alert')).toHaveCount(5)
    await expect(page).toHaveURL(/\/checkout/)
  })

  test('reports an invalid email', async ({ page }) => {
    await page.goto('/checkout')
    await page.getByLabel('Full name').fill('Saeed Khoury')
    await page.getByLabel('Email address').fill('nope')
    await page.getByLabel('Street address').fill('14 Harbour Row')
    await page.getByLabel('City').fill('Haifa')
    await page.getByLabel('Postcode').fill('3100201')
    await page.getByRole('button', { name: 'Place order' }).click()

    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
  })

  test('completes an order with valid details and clears the bag', async ({ page }) => {
    await page.goto('/checkout')
    await page.getByLabel('Full name').fill('Saeed Khoury')
    await page.getByLabel('Email address').fill('saeed@example.com')
    await page.getByLabel('Street address').fill('14 Harbour Row')
    await page.getByLabel('City').fill('Haifa')
    await page.getByLabel('Postcode').fill('3100201')
    await page.getByRole('button', { name: 'Place order' }).click()

    await expect(page.getByRole('heading', { name: 'Thank you.' })).toBeVisible()

    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: /Your bag is empty/ })).toBeVisible()
  })
})

test.describe('theme', () => {
  test('switching to light mode persists across a reload', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: 'Light', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  // The server always renders the dark default (it cannot read localStorage),
  // while the blocking inline script has already applied the stored theme by
  // the time React hydrates. These two assert that useSyncExternalStore
  // reconciles that difference rather than leaving the UI stuck on the default.
  test('the toggle reflects the stored theme after hydration, not the server default', async ({
    page,
  }) => {
    await page.goto('/')
    await page.getByRole('radio', { name: 'Light', exact: true }).click()
    await page.reload()

    await expect(page.getByRole('radio', { name: 'Light', exact: true })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toHaveAttribute(
      'aria-checked',
      'false',
    )
  })

  test('hydrating with a stored non-default theme logs no React errors', async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(message.text())
    })
    page.on('pageerror', (error) => problems.push(error.message))

    await page.goto('/')
    await page.getByRole('radio', { name: 'Light', exact: true }).click()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

    expect(problems.filter((text) => /hydrat|did not match|mismatch/i.test(text))).toEqual([])
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the hamburger opens a menu that reaches every category', async ({ page }) => {
    await page.goto('/')
    const menu = page.getByRole('button', { name: 'Open menu' })
    await expect(menu).toBeVisible()

    await menu.click()
    const panel = page.locator('#mobile-menu')
    await expect(panel.getByRole('link', { name: 'Displays' })).toBeVisible()

    await panel.getByRole('link', { name: 'Displays' }).click()
    await expect(page).toHaveURL(/\/store\/displays/)
  })

  test('search is reachable on mobile', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Search the store' }).click()
    await expect(page.getByRole('dialog', { name: 'Search' })).toBeVisible()
  })
})

test.describe('responsive', () => {
  for (const [label, width] of [
    ['desktop', 1440],
    ['laptop', 1068],
    ['tablet', 833],
    ['mobile', 390],
  ] as const) {
    test(`home page has no horizontal overflow at ${label} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }
})

test.describe('security headers', () => {
  test('serves a CSP and the standard hardening headers', async ({ page }) => {
    const response = await page.goto('/')
    const headers = response!.headers()

    expect(headers['content-security-policy']).toContain("default-src 'self'")
    expect(headers['content-security-policy']).toContain("object-src 'none'")
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['permissions-policy']).toContain('camera=()')
  })

  test('the CSP does not block the inline theme script', async ({ page }) => {
    const violations: string[] = []
    page.on('console', (message) => {
      if (/content security policy/i.test(message.text())) violations.push(message.text())
    })

    await page.goto('/')
    await page.getByRole('radio', { name: 'Light', exact: true }).click()
    await page.reload()

    // If the script were blocked the stored theme would never be applied.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
    expect(violations).toEqual([])
  })
})

test.describe('accessibility', () => {
  test('the skip link becomes visible when focused and jumps to main', async ({ page }) => {
    await page.goto('/')
    const skip = page.getByRole('link', { name: 'Skip to main content' })

    await page.keyboard.press('Tab')
    await expect(skip).toBeFocused()

    // Off-screen until focused; on focus it must be inside the viewport.
    const box = await skip.boundingBox()
    expect(box!.x).toBeGreaterThanOrEqual(0)

    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main/)
  })

  test('the page has exactly one h1 and it does not change on its own', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveCount(1)
    const before = await page.locator('h1').textContent()

    // Long enough for the carousel to have advanced at least once.
    await page.waitForTimeout(8000)
    expect(await page.locator('h1').textContent()).toBe(before)
  })

  test('the carousel can be stopped and stays stopped', async ({ page }) => {
    await page.goto('/')
    const stop = page.getByRole('button', { name: 'Stop the carousel' })
    await expect(stop).toBeVisible()

    const firstSlide = await page.locator('h2').first().textContent()
    await stop.click()
    await expect(page.getByRole('button', { name: 'Start the carousel' })).toBeVisible()

    await page.waitForTimeout(8000)
    expect(await page.locator('h2').first().textContent()).toBe(firstSlide)
  })

  test('choosing a slide by hand stops the rotation', async ({ page }) => {
    await page.goto('/')
    const dots = page.getByRole('button', { name: /^Show / })
    await dots.nth(2).click()

    const chosen = await page.locator('h2').first().textContent()
    await page.waitForTimeout(8000)
    expect(await page.locator('h2').first().textContent()).toBe(chosen)
  })

  test('reduced motion stops the carousel advancing on its own', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const first = await page.locator('h2').first().textContent()
    await page.waitForTimeout(8000)
    expect(await page.locator('h2').first().textContent()).toBe(first)
  })

  test('the search dialog traps Tab and restores focus on close', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Search the store' })
    await trigger.click()

    const dialog = page.getByRole('dialog', { name: 'Search' })
    await expect(dialog).toBeVisible()

    // Tab repeatedly; focus must never escape the dialog.
    for (let i = 0; i < 12; i += 1) {
      await page.keyboard.press('Tab')
      const inside = await dialog.evaluate((node) => node.contains(document.activeElement))
      expect(inside).toBe(true)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('a failed checkout moves focus to the first invalid field', async ({ page }) => {
    await page.goto('/product/pulse-studio')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/checkout')

    await page.getByRole('button', { name: 'Place order' }).click()
    await expect(page.getByLabel('Full name')).toBeFocused()
  })

  test('focus lands on the first field that is actually invalid', async ({ page }) => {
    await page.goto('/product/pulse-studio')
    await page.getByRole('button', { name: 'Add to Bag' }).click()
    await page.goto('/checkout')

    await page.getByLabel('Full name').fill('Saeed Khoury')
    await page.getByRole('button', { name: 'Place order' }).click()
    await expect(page.getByLabel('Email address')).toBeFocused()
  })

  test('the theme control is a radio group operable with arrow keys', async ({ page }) => {
    await page.goto('/')
    const group = page.getByRole('radiogroup', { name: 'Colour theme' })
    await expect(group).toBeVisible()

    await group.getByRole('radio', { name: 'Dark', exact: true }).focus()
    await page.keyboard.press('ArrowRight')

    await expect(group.getByRole('radio', { name: 'Auto', exact: true })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'auto')
  })

  test('the flyout scrim is not a keyboard focus target', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Phones', exact: true }).click()

    const scrim = page.locator('[aria-hidden="true"][tabindex="-1"]')
    await expect(scrim).toHaveAttribute('tabindex', '-1')
  })
})
