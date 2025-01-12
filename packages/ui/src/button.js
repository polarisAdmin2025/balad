'use client'

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  onClick,
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
