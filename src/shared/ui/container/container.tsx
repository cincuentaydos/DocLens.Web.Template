import type { HTMLAttributes, PropsWithChildren } from 'react'

type ContainerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export const Container = ({ children, className, ...props }: ContainerProps) => {
  const resolvedClassName = ['container', className].filter(Boolean).join(' ')

  return (
    <div className={resolvedClassName} {...props}>
      {children}
    </div>
  )
}
