import { SectionHeader } from '@/components/ui/SectionHeader'

const TOPICS = [
  {
    title: 'Delivery',
    body: 'Every order ships free and arrives within two working days. You will get a tracking link by email as soon as the parcel leaves the warehouse.',
  },
  {
    title: 'Returns',
    body: 'Changed your mind? Send anything back within thirty days in its original packaging for a full refund. No restocking fee, ever.',
  },
  {
    title: 'Warranty',
    body: 'All hardware carries a two-year limited warranty covering manufacturing defects. Extended cover is available at checkout on selected products.',
  },
  {
    title: 'Contact',
    body: 'Our specialists are available 09:00–18:00, Sunday to Thursday. This is a demonstration store, so the contact channels are not live.',
  },
]

export const metadata = { title: 'Support — Axiom Store' }

export default function SupportPage() {
  return (
    <div className="container container--narrow section">
      <SectionHeader title="Support" subtitle="Answers to the questions we get most." />
      {TOPICS.map((topic) => (
        <section key={topic.title} style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-24)', marginBottom: 'var(--space-2)' }}>
            {topic.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{topic.body}</p>
        </section>
      ))}
    </div>
  )
}
