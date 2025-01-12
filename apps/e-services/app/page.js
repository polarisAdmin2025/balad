'use client'

import Header from '@repo/ui/header'
import Link from 'next/link'

const Home = () => {
  return (
    <div>
      <Header />
      <div className="content-container" style={{ 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 114px)'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '800px'
        }}>
          <h1 style={{ 
            fontSize: '36px',
            color: '#17406D',
            marginBottom: '20px',
            fontFamily: 'Cairo, sans-serif'
          }}>
            مرحباً بكم في بوابة بلد للخدمات الإلكترونية
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            lineHeight: 1.6,
            marginBottom: '30px'
          }}>
            نقدم لكم مجموعة متكاملة من الخدمات الإلكترونية لتلبية احتياجاتكم
          </p>
          <Link 
            href="/services"
            className="explore-services-button"
            style={{
              display: 'inline-block',
              backgroundColor: '#17406D',
              color: 'white',
              padding: '15px 40px',
              borderRadius: '30px',
              textDecoration: 'none',
              fontSize: '18px',
              transition: 'all 0.3s ease',
              fontFamily: 'Cairo, sans-serif'
            }}
          >
            استكشف خدماتنا
          </Link>
        </div>
      </div>
      <style jsx>{`
        .explore-services-button:hover {
          background-color: #1a4b7c !important;
        }
      `}</style>
    </div>
  )
}

export default Home