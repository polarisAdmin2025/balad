'use client'

import Header from '@repo/ui/header'
import { getAction } from '@repo/ui/util/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Services = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAction('/admin-config/main-category')
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
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
        minHeight: 'calc(100vh - 114px)'      }}>
        <h1 style={{ 
          textAlign: 'right', 
          marginBottom: '40px', 
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: 'bold',
          alignSelf: 'flex-end'
        }}>
          الخدمات
        </h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          width: '100%',
          justifyContent: 'center',
          alignContent: 'center',
          flex: 1
        }}>
          {categories.map((category) => (
            <Link 
              key={category.id}
              href={`/${category.code === '01' ? 'individual-services' : category.english_name.toLowerCase().replace(' ', '-')}`}
              style={{
                backgroundColor: '#F8F9FF',
                padding: '60px 20px',
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
                  src={`/images/${
                    category.code === '01' 
                      ? 'government-14_svgrepo.com' 
                      : category.code === '02' 
                      ? 'Business Documentation'
                      : 'Company'
                  }.svg`}
                  alt={category.english_name}
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
                {category.arabic_name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services