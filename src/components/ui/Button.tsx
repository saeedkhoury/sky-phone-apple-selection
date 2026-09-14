import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'quiet'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  block?: boolean
  large?: boolean
  className?: string
}

interface LinkButtonProps extends BaseProps {
  href: string
}

type ActionButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

function classesFor({ variant = 'primary', block, large, className }: BaseProps): string {
  return [
    styles.button,
    variant === 'secondary' && styles.secondary,
    variant === 'quiet' && styles.quiet,
    block && styles.block,
    large && styles.large,
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/** Renders an anchor when `href` is given, otherwise a real button. */
export function Button(props: LinkButtonProps | ActionButtonProps) {
  if ('href' in props && props.href !== undefined) {
    const { href, children, variant, block, large, className } = props
    return (
      <Link href={href} className={classesFor({ children, variant, block, large, className })}>
        {children}
      </Link>
    )
  }

  const { children, variant, block, large, className, ...rest } = props as ActionButtonProps
  return (
    <button className={classesFor({ children, variant, block, large, className })} {...rest}>
      {children}
    </button>
  )
}
