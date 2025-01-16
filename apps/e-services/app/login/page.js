'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@repo/ui/auth/input-field'
import AuthButton from '@repo/ui/auth/auth-button'
import AuthCard from '@repo/ui/auth/auth-card'

const Login = () => {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: ''
  })
  const [isResetMode, setIsResetMode] = useState(false)
  const [resetUsername, setResetUsername] = useState('')
  const [resetStatus, setResetStatus] = useState('')

  useEffect(() => {
    const isLoggedIn = document.cookie.includes('isLoggedIn=true')
    if (isLoggedIn) {
      router.push('/individual-services/issue-commercial-license')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (credentials.username === 'admin' && credentials.password === 'Admin123!') {
        document.cookie = 'isLoggedIn=true; path=/'
        router.push('/individual-services/issue-commercial-license')
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
    try {
      const emailResponse = await fetch(`https://172.16.2.57/api/v1/auth/get-email/?username=${resetUsername}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!emailResponse.ok) {
        throw new Error('User not found')
      }

      const { email } = await emailResponse.json()

      const resetResponse = await fetch('https://172.16.2.57/api/v1/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          email_host: 'mail.polaris-tek.com',
          email_port: 587,
          email_use_tls: true,
          email_host_user: 'noreply@polaris-tek.com',
          email_host_password: 'P@ssw0rd',
          default_from_email: 'noreply@polaris-tek.com'
        })
      })

      if (resetResponse.ok) {
        setResetStatus('Password reset link has been sent to your email')
        setTimeout(() => {
          setIsResetMode(false)
          setResetStatus('')
        }, 3000)
      } else {
        throw new Error('Failed to send reset email')
      }
    } catch (error) {
      setResetStatus(error.message === 'User not found' ? 'User not found' : 'Failed to send reset email. Please try again.')
    }
  }

  if (isResetMode) {
    return (
      <AuthCard>
        <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#17406D' }}>Reset Password</h2>
          <div style={{ marginBottom: '24px' }}>
            <InputField
              type="text"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              placeholder="اسم المستخدم/رقم الهوية"
              required
              icon={<Image src="/images/users.svg" alt="User Icon" width={20} height={20} />}
            />
          </div>

          {resetStatus && (
            <p style={{ 
              color: resetStatus.includes('Failed') || resetStatus.includes('not found') ? '#dc2626' : '#16a34a',
              fontSize: '14px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {resetStatus}
            </p>
          )}

          <AuthButton type="submit" style={{ marginBottom: '16px' }}>
            إرسال رابط إعادة التعيين
          </AuthButton>

          <AuthButton variant="secondary" onClick={() => setIsResetMode(false)}>
            العودة لتسجيل الدخول
          </AuthButton>
        </form>
      </AuthCard>
    )
  }

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <div style={{ marginBottom: '16px' }}>
          <InputField
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="اسم المستخدم/رقم الهوية"
            icon={<Image src="/images/users.svg" alt="User Icon" width={20} height={20} />}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <InputField
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="كلمة المرور"
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 8.33333V6.66667C5 4.08934 7.08934 2 9.66667 2H10.3333C12.9107 2 15 4.08934 15 6.66667V8.33333M5 8.33333H15M5 8.33333H3.33333M15 8.33333H16.6667M6.66667 18H13.3333C14.7335 18 15.4336 18 15.9683 17.7275C16.4387 17.4878 16.8212 17.1054 17.0608 16.635C17.3333 16.1002 17.3333 15.4002 17.3333 14V12.3333C17.3333 10.9331 17.3333 10.2331 17.0608 9.69834C16.8212 9.22791 16.4387 8.84547 15.9683 8.60582C15.4336 8.33333 14.7335 8.33333 13.3333 8.33333H6.66667C5.26654 8.33333 4.56647 8.33333 4.03169 8.60582C3.56126 8.84547 3.17882 9.22791 2.93917 9.69834C2.66667 10.2331 2.66667 10.9331 2.66667 12.3333V14C2.66667 15.4002 2.66667 16.1002 2.93917 16.635C3.17882 17.1054 3.56126 17.4878 4.03169 17.7275C4.56647 18 5.26654 18 6.66667 18Z" stroke="#8C8C8C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
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

        <AuthButton type="submit" style={{ marginBottom: '24px' }}>
          تسجيل الدخول
        </AuthButton>

        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
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

          <div style={{
            fontSize: '14px',
            color: '#666666',
            textAlign: 'center'
          }}>
            ليس لديك حساب؟{' '}
            <a 
              href="/signup"
              style={{
                color: '#17406D',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              انشاء حساب جديد
            </a>
          </div>
        </div>
      </form>
    </AuthCard>
  )
}

export default Login