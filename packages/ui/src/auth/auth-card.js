'use client'

import Image from 'next/image'

const AuthCard = ({ children, hideImage = false }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px',
      paddingBottom: '100px',
      backgroundColor: '#FFFFFF'
    }}>
      <div style={{
        width: '100%',
        maxWidth: hideImage ? '1200px' : '545px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid #17406D',
        margin: '0 20px'
      }}>
        {!hideImage && (
          <div style={{ marginBottom: '48px', textAlign: 'center', paddingTop: '30px' }}>
            <Image
              src="/images/Polaris-Logo 4.svg"
              alt="Balad Logo"
              width={545}
              height={171}
              priority
            />
          </div>
        )}
        <div style={{
          position: 'relative',
          background: 'white',
          paddingInline: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {children}
        </div>
        <Image
          src="/images/Variant4.png"
          alt="Background"
          width={545}
          height={250}
          style={{
            width: '100%',
            display: 'block',
                marginTop: '-25%'
          }}
        />
      </div>
    </div>
  )
}

export default AuthCard