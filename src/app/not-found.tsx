import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: 'center', paddingBlock: '120px' }}>
      <h1 style={{ fontSize: 'var(--fs-44)', marginBottom: 'var(--space-4)' }}>
        We can&apos;t find that page.
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
        The link may be out of date, or the product may no longer be available.
      </p>
      <Button href="/" large>
        Back to the store
      </Button>
    </div>
  )
}
