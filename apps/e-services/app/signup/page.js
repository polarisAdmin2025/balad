'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '@repo/ui/auth/input-field'
import AuthButton from '@repo/ui/auth/auth-button'
import AuthCard from '@repo/ui/auth/auth-card'
import AuthNavbar from '@repo/ui/auth/auth-navbar'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const Signup = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstNameAr: '',
    secondNameAr: '',
    thirdNameAr: '',
    lastNameAr: '',
    firstNameEn: '',
    lastNameEn: '',
    phone: '',
    email: '',
    idNumber: '',
    idExpiryDate: '',
    agreeToTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePhoneChange = (value) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Add registration logic here
  }

  return (
    <>
      <AuthNavbar />
      <div style={{
        minHeight: 'calc(100vh - 114px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '48px',
          border: '2px solid #17406D'
        }}>
          <h2 style={{ 
            textAlign: 'right', 
            marginBottom: '32px',
            color: '#17406D',
            fontSize: '24px'
          }}>
            تسجيل حساب جديد
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  اسم المستخدم <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="اسم المستخدم"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  كلمة المرور <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="كلمة المرور"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  تأكيد كلمة المرور <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="تأكيد كلمة المرور"
                  required
                />
              </div>
            </div>

            <p style={{ 
              textAlign: 'right',
              marginBottom: '16px',
              color: '#666',
              fontSize: '14px'
            }}>
              يرجى إدخال الاسم كما هو في الهوية/الإقامة
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  الاسم الأول بالعربي <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="firstNameAr"
                  value={formData.firstNameAr}
                  onChange={handleChange}
                  placeholder="الاسم الأول بالعربي"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  الاسم الثاني بالعربي <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="secondNameAr"
                  value={formData.secondNameAr}
                  onChange={handleChange}
                  placeholder="الاسم الثاني بالعربي"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  اسم الثالث بالعربي
                </label>
                <InputField
                  type="text"
                  name="thirdNameAr"
                  value={formData.thirdNameAr}
                  onChange={handleChange}
                  placeholder="اسم الثالث بالعربي"
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  اسم العائلة بالعربي <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="lastNameAr"
                  value={formData.lastNameAr}
                  onChange={handleChange}
                  placeholder="اسم العائلة بالعربي"
                  required
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  الاسم الأول بالإنجليزي <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="firstNameEn"
                  value={formData.firstNameEn}
                  onChange={handleChange}
                  placeholder="الاسم الأول بالإنجليزي"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  اسم العائلة بالإنجليزي <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="lastNameEn"
                  value={formData.lastNameEn}
                  onChange={handleChange}
                  placeholder="اسم العائلة بالإنجليزي"
                  required
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  رقم الهوية/الإقامة <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="رقم الهوية/الإقامة"
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  تاريخ انتهاء الهوية/الإقامة <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="date"
                  name="idExpiryDate"
                  value={formData.idExpiryDate}
                  onChange={handleChange}
                  placeholder="تاريخ انتهاء الهوية/الإقامة"
                  required
                />
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  رقم الهاتف <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ direction: 'ltr' }}>
                  <PhoneInput
                    country="jo"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      required: true,
                      placeholder: '7X XXX XXXX'
                    }}
                    containerStyle={{
                      direction: 'ltr'
                    }}
                    inputStyle={{
                      width: '100%',
                      height: '48px',
                      fontSize: '14px',
                      color: '#8C8C8C'
                    }}
                    buttonStyle={{
                      backgroundColor: '#f5f5f5',
                      borderColor: '#E6E6E6',
                      borderRight: '1px solid #E6E6E6'
                    }}
                    dropdownStyle={{
                      width: 'max-content'
                    }}
                    enableSearch={false}
                    countryCodeEditable={false}
                  />
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  textAlign: 'right',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  البريد الإلكتروني <span style={{ color: 'red' }}>*</span>
                </label>
                <InputField
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني"
                  required
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
              direction: 'rtl'
            }}>
              <input
                type="checkbox"
                id="terms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="terms" style={{ color: '#666', fontSize: '14px' }}>
                أوافق على الشروط والأحكام وسياسة الخصوصية.
              </label>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <AuthButton type="submit">
                تسجيل
              </AuthButton>
              <AuthButton 
                variant="secondary" 
                onClick={() => router.push('/login')}
              >
                إلغاء
              </AuthButton>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup