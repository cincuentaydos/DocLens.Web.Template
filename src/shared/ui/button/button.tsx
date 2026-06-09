import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonOwnProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  variant?: ButtonVariant
}

type ButtonProps<T extends ElementType> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps<T>>

export const Button = <T extends ElementType = 'button'>({
  as,
  children,
  className,
  variant = 'primary',
  ...props
}: ButtonProps<T>) => {
  const Component = as ?? 'button'
  const resolvedClassName = ['button', `button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={resolvedClassName} {...props}>
      {children}
    </Component>
  )
}
