'use client'

import Image from 'next/image'

const AuthNavbar = () => {
  return (
    <div style={{
      width: '100%',
      height: '114px',
      backgroundColor: '#17406D',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: '0 40px'
    }}>
      <Image
        src="/images/Polaris-White-Logo.svg"
        alt="Balad Logo"
        width={181.91}
        height={75}
        priority
          
      />
    </div>
  )
}

export default AuthNavbar