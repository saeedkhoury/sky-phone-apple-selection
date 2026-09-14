import Link from 'next/link'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: { href: string; label: string }
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <Link href={action.href}>{action.label} ›</Link>}
    </header>
  )
}
