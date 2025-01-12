'use client'

import Header from '@repo/ui/header'
import { getAction } from '@repo/ui/util/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ProfessionalServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAction('/admin-config/services/?category_code=02')
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content-container">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="content-container" style={{ 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 114px)',
        backgroundColor: '#17406D'
      }}>
        <h1 style={{ 
          textAlign: 'right', 
          marginBottom: '40px', 
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: '1200px'
        }}>
          رخص مهنية
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {services.map((service) => (
            <Link 
              key={service.id}
              href={`/individual-services/issue-professional-license`}
              style={{
                backgroundColor: '#F8F9FF',
                padding: '40px 20px',
                borderRadius: '10px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#17406D',
                margin: 0,
                fontFamily: 'Cairo, sans-serif'
              }}>
                {service.arabic_name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalServices