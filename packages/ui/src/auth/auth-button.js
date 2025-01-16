'use client'

const AuthButton = ({
  type = 'button',
  onClick,
  variant = 'primary',
  children,
  disabled = false,
  style = {}
}) => {
  const baseStyle = {
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    border: variant === 'primary' ? 'none' : '1px solid #17406D',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: variant === 'primary' ? '#17406D' : 'transparent',
    color: variant === 'primary' ? 'white' : '#17406D',
    transition: 'all 0.2s',
    '&:hover': {
      opacity: 0.9
    },
    ...style
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
    >
      {children}
    </button>
  )
}

export default AuthButton