'use client'

import Image from 'next/image'

const InputField = ({ 
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon,
  required = false
}) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      marginBottom: '16px'
    }}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          height: '48px',
          padding: '12px 16px 12px 48px',
          borderRadius: '8px',
          border: '1px solid #E6E6E6',
          fontSize: '14px',
          textAlign: 'right',
          direction: 'rtl',
          backgroundColor: 'white',
          transition: 'border-color 0.2s',
          '&:focus': {
            borderColor: '#17406D',
            outline: 'none'
          }
        }}
      />
      <div style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.6
      }}>
        {icon}
      </div>
    </div>
  )
}

export default InputField