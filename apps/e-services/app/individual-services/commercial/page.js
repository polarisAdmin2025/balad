'use client'

import Header from '@repo/ui/header'
import { getAction } from '@repo/ui/util/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useStore from '@repo/ui/store'
import { useRouter } from 'next/navigation'

const CommercialServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const { ICLApp,setICLApp } = useStore()
  const router = useRouter()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAction('/admin-config/services/?category_code=01')
        setServices(data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleServiceClick = (e, path , service) => {
    e.preventDefault()
    // Check if user is logged in
    const isLoggedIn = document.cookie.includes('isLoggedIn=true')
    
    // Set the service code first
    setICLApp('service_code', service.code)
    
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      router.push(path)
    }
  }

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
        minHeight: 'calc(100vh - 114px)'
      }}>
        <h1 style={{ 
          textAlign: 'right',
          marginBottom: '40px', 
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          width: '100%',
          maxWidth: '1200px',
          alignSelf: 'flex-end'
        }}>
          رخص تجارية
        </h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {services.map((service) => (
            <Link 
              key={service.id}
              href={service.code === '01' ? '/individual-services/issue-commercial-license' : '#'}
              onClick={(e) => handleServiceClick(
                e, 
                service.code === '01' ? '/individual-services/issue-commercial-license' : '/individual-services/cancel-commercial-license',
                service
              )}
              style={{
                backgroundColor: '#F8F9FF',
                padding: '60px 20px',
                width: '380px',
                minHeight: '280px',
                borderRadius: '10px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '30px',
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
              <div style={{ width: '80px', height: '80px' }}>
                <img 
                  src={`/images/${service.code === '01' ? 'Document Exchange' : 
                         service.code === '02' ? 'Cancel Delete' :
                         service.code === '03' ? 'Upload File' :
                         'Document Exchange'}.svg`}
                  alt={service.english_name}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <h2 style={{
                fontSize: '24px',
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

export default CommercialServices