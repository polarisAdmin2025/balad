'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStore from '@repo/ui/store'

const Login = () => {
  const router = useRouter()
  const [isResetMode, setIsResetMode] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  })
  const { ICLApp } = useStore()

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('isLoggedIn=true')
    if (isLoggedIn) {
      handleRedirect()
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
    setErrors(prev => ({
      ...prev,
      [name]: '',
      general: ''
    }))
  }

  const handleRedirect = () => {
    if (ICLApp?.service_code === '01') {
      router.push('/individual-services/issue-commercial-license')
    } else if (ICLApp?.service_code === '02') {
      router.push('/individual-services/commercial/cancel-commercial-license')
    } else {
      // Default route if no service code is set
      router.push('/services')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (credentials.username === 'admin' && credentials.password === 'Admin123!') {
        document.cookie = 'isLoggedIn=true; path=/'
        handleRedirect()
      } else {
        setErrors(prev => ({
          ...prev,
          general: 'Invalid username or password'
        }))
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        general: 'An error occurred during login'
      }))
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    // Will be implemented when the API is ready
    console.warn('Reset password functionality will be implemented')
  }

  const cardStyle = {
    width: '545px',
    position: 'relative',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '2px solid #17406D',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  }

  const backgroundStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    background: `url('/images/Variant4.png') no-repeat bottom center`,
    backgroundSize: 'cover',
    opacity: 0.15,
    zIndex: 0
  }

  const contentStyle = {
    position: 'relative',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1
  }

  if (isResetMode) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '100px',
        backgroundColor: '#F5F5F5'
      }}>
        <div style={cardStyle}>
          <div style={backgroundStyle} />
          <div style={contentStyle}>
            <div style={{ marginBottom: '48px', textAlign: 'center' }}>
              <Image
                src="/images/Polaris-Logo 4.svg"
                alt="Balad Logo"
                width={545}
                height={171}
                priority
              />
            </div>

            <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  position: 'relative',
                  width: '100%'
                }}>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="اسم المستخدم/رقم الهوية"
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '12px 16px 12px 48px',
                      borderRadius: '8px',
                      border: '1px solid #E6E6E6',
                      fontSize: '14px',
                      textAlign: 'right',
                      direction: 'rtl'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>
                    <Image
                      src="/images/users.svg"
                      alt="User Icon"
                      width={20}
                      height={20}
                    />
                  </div>
                </div>
              </div>

              {errors.general && (
                <p style={{ 
                  color: '#dc2626',
                  fontSize: '14px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {errors.general}
                </p>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  style={{
                    height: '48px',
                    backgroundColor: 'transparent',
                    color: '#17406D',
                    borderRadius: '8px',
                    border: '1px solid #17406D',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '0 20px'
                  }}
                >
                  العودة
                </button>
                <button
                  type="submit"
                  style={{
                    height: '48px',
                    backgroundColor: '#17406D',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    padding: '0 20px'
                  }}
                >
                  إرسال
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '100px',
      backgroundColor: '#F5F5F5'
    }}>
      <div style={cardStyle}>
        <div style={backgroundStyle} />
        <div style={contentStyle}>
          <div style={{ marginBottom: '48px', textAlign: 'center' }}>
            <Image
              src="/images/Polaris-Logo 4.svg"
              alt="Balad Logo"
              width={545}
              height={171}
              priority
            />
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                position: 'relative',
                width: '100%'
              }}>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="اسم المستخدم/رقم الهوية"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '12px 16px 12px 48px',
                    borderRadius: '8px',
                    border: '1px solid #E6E6E6',
                    fontSize: '14px',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <Image
                    src="/images/users.svg"
                    alt="User Icon"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{
                position: 'relative',
                width: '100%'
              }}>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="كلمة المرور"
                  style={{
                    width: '100%',
                    height: '48px',
                    padding: '12px 16px 12px 48px',
                    borderRadius: '8px',
                    border: '1px solid #E6E6E6',
                    fontSize: '14px',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 8.33333V6.66667C5 4.08934 7.08934 2 9.66667 2H10.3333C12.9107 2 15 4.08934 15 6.66667V8.33333M5 8.33333H15M5 8.33333H3.33333M15 8.33333H16.6667M6.66667 18H13.3333C14.7335 18 15.4336 18 15.9683 17.7275C16.4387 17.4878 16.8212 17.1054 17.0608 16.635C17.3333 16.1002 17.3333 15.4002 17.3333 14V12.3333C17.3333 10.9331 17.3333 10.2331 17.0608 9.69834C16.8212 9.22791 16.4387 8.84547 15.9683 8.60582C15.4336 8.33333 14.7335 8.33333 13.3333 8.33333H6.66667C5.26654 8.33333 4.56647 8.33333 4.03169 8.60582C3.56126 8.84547 3.17882 9.22791 2.93917 9.69834C2.66667 10.2331 2.66667 10.9331 2.66667 12.3333V14C2.66667 15.4002 2.66667 16.1002 2.93917 16.635C3.17882 17.1054 3.56126 17.4878 4.03169 17.7275C4.56647 18 5.26654 18 6.66667 18Z" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div style={{ 
              textAlign: 'right', 
              marginBottom: '24px'
            }}>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  setIsResetMode(true)
                }}
                style={{
                  color: '#17406D',
                  fontSize: '14px',
                  textDecoration: 'none'
                }}
              >
                نسيت كلمة المرور؟
              </a>
            </div>

            {errors.general && (
              <p style={{ 
                color: '#dc2626',
                fontSize: '14px',
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#17406D',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login