'use client'

import { useEffect, useState, useRef } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { Button } from '../button'
import { useRouter } from 'next/navigation'
import Modal from '../modal/modal'
import { getAction } from '../util/actions'
import { applicantSchema } from '../util/zod'
import LoadingBar from '../skeletons/loading-bar'

const Applicant = () => {
  const { ICLApp, setICLApp, currentStep, setCurrentStep } = useStore()
  const { isOpen, showModal, closeModal } = useModal()
  const [errors, setErrors] = useState({})
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const [typing, setTyping] = useState(false)
  const typingTimeout = useRef(null)
  const router = useRouter()

  // Mock data for stores - in production this would come from an API
  const stores = [
    { id: '1', licenseNumber: '123654789', name: 'Store XXXXXXXXX' },
    { id: '2', licenseNumber: '158745236', name: 'Market XXXXXXX' },
    { id: '3', licenseNumber: '1587423', name: 'XXXXXXXXXXX' }
  ]

  useEffect(() => {
    const fetchApplicantType = async () => {
      try {
        const applicantTypeResponse = await getAction('/admin-config/applicant-type/')
        const commissionerResponse = await getAction('/admin-config/commissioner/')
        setConfig({
          applicantType: applicantTypeResponse,
          commissioner: commissionerResponse
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching applicant type:', error)
        setLoading(false)
      }
    }

    fetchApplicantType()
  }, [])

  const handleCancel = () => {
    router.push('/')
  }

  const handleNextAction = () => {
    const validationResult = applicantSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
      return
    }
    setErrors({})
    setCurrentStep(currentStep + 1)
  }

  const handleApplicantTypeChange = e => {
    // Reset all related fields when applicant type changes
    setICLApp('ApplicantType', e.target.value)
    setICLApp('OnBehalf', '') // Reset Authorized on Behalf
    setICLApp('RegInfo', { Valid: true }) // Reset RegInfo
    setICLApp('selectedStores', []) // Reset selected stores
    setErrors({})
  }

  const handleStoreSelect = (storeId) => {
    const currentSelected = ICLApp?.selectedStores || []
    const newSelected = currentSelected.includes(storeId)
      ? currentSelected.filter(id => id !== storeId)
      : [...currentSelected, storeId]
    
    setICLApp('selectedStores', newSelected)
    setErrors(prev => ({...prev, selectedStores: null}))
  }

  const handleCommercialRegisterationNo = e => {
    setTyping(true)
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    const newRegInfo = {
      ...ICLApp.RegInfo,
      commercial_record: e.target.value,
      Show: false
    }

    setICLApp('RegInfo', newRegInfo)
    setICLApp('selectedStores', []) // Reset selected stores when commercial registration changes
    setErrors({})

    typingTimeout.current = setTimeout(() => {
      // Simulate API call
      if (e.target.value === '123') {
        setICLApp('RegInfo', {
          commercial_record: e.target.value,
          Valid: true,
          Show: true
        })
        setErrors({})
      } else {
        setICLApp('RegInfo', {
          commercial_record: e.target.value,
          Valid: false,
          Show: false
        })
        setErrors(prev => ({
          ...prev,
          RegInfo: {
            _errors: ['Invalid commercial registration number']
          }
        }))
      }
      setTyping(false)
    }, 500)
  }

  if (loading) {
    return <div className="content-container">Loading...</div>
  }

  return (
    <div className="content-container">
      {isOpen && (
        <Modal>
          <Modal.Title closeModal={closeModal}>Cancel Application</Modal.Title>
          <Modal.Content>
            Are you sure you want to close? All information will be lost
          </Modal.Content>
          <Modal.Footer>
            <Button disabled={loading} variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleCancel}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <form className="form-content">
        <div className="grid grid-col-2">
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="applicant-type" className="required">
              Applicant Type
            </label>
            <select
              name="applicant-type"
              id="applicant-type"
              className={`select-tag ${errors?.ApplicantType ? 'input-error' : ''}`}
              value={ICLApp?.ApplicantType}
              onChange={handleApplicantTypeChange}
            >
              <option value="">Select Applicant Type</option>
              {config?.applicantType?.map(type => (
                <option key={type.english_name} value={type.code}>
                  {type.english_name}
                </option>
              ))}
            </select>
            {errors.ApplicantType && (
              <p className="error-msg">{errors.ApplicantType._errors[0]}</p>
            )}
          </div>

          {ICLApp?.ApplicantType === '02' && (
            <div
              data-aos="fade-left"
              data-aos-offset="0"
              className="field-container"
              style={{ gridColumn: 2, gridRow: 1 }}
            >
              <label htmlFor="authorized-on-behalf" className="required">
                Authorized on Behalf
              </label>
              <select
                name="authorized-on-behalf"
                id="authorized-on-behalf"
                className={`select-tag ${errors?.OnBehalf ? 'input-error' : ''}`}
                value={ICLApp?.OnBehalf}
                onChange={(e) => {
                  setICLApp('OnBehalf', e.target.value)
                  setICLApp('RegInfo', { Valid: true }) // Reset RegInfo
                  setICLApp('selectedStores', []) // Reset selected stores
                  setErrors({})
                }}
              >
                <option value="">Select Authorization Type</option>
                {config?.commissioner?.map(type => (
                  <option key={type.english_name} value={type.code}>
                    {type.english_name}
                  </option>
                ))}
              </select>
              {errors.OnBehalf && (
                <p className="error-msg">{errors.OnBehalf._errors[0]}</p>
              )}
            </div>
          )}
        </div>

        {ICLApp?.ApplicantType === '01' && (
          <>
            <div className="grid grid-col-2" style={{ marginTop: '20px' }}>
              <div
                data-aos="fade-right"
                className="field-container"
                style={{ gridColumn: 1 }}
              >
                <label htmlFor="applicant-name">Applicant Name</label>
                <input
                  type="text"
                  id="applicant-name"
                  name="applicant-name"
                  className="select-tag"
                  value={ICLApp?.applicantName || ''}
                  onChange={(e) => setICLApp('applicantName', e.target.value)}
                  disabled
                />
              </div>
              <div
                data-aos="fade-right"
                className="field-container"
                style={{ gridColumn: 2 }}
              >
                <label htmlFor="applicant-id">Applicant ID</label>
                <input
                  type="text"
                  id="applicant-id"
                  name="applicant-id"
                  className="select-tag"
                  value={ICLApp?.applicantId || ''}
                  onChange={(e) => setICLApp('applicantId', e.target.value)}
                  disabled
                />
              </div>
            </div>
            {errors?.selectedStores && (
              <p className="error-msg error-bg">{errors.selectedStores._errors[0]}</p>
            )}
            <div style={{ 
              width: '100%', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              overflow: 'hidden',
              marginTop: '20px'
            }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: 'white'
              }}>
                <thead>
                  <tr style={{ 
                    backgroundColor: '#17406d',
                    borderBottom: '1px solid #e5e7eb',
                    color: '#ffff'
                  }}>
                    <th style={{ 
                      padding: '12px 24px', 
                      textAlign: 'left',
                      color: '#ffff',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>License Number</th>
                    <th style={{ 
                      padding: '12px 24px', 
                      textAlign: 'left',
                      color: '#ffff',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>Store Name</th>
                    <th style={{ 
                      padding: '12px 24px', 
                      width: '80px',
                      textAlign: 'center'
                    }}>Select</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(store => (
                    <tr 
                      key={store.id}
                      style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: (ICLApp?.selectedStores || []).includes(store.id) 
                          ? '#f3f4f6' 
                          : 'white'
                      }}
                    >
                      <td style={{ 
                        padding: '16px 24px',
                        textAlign: 'left',
                        color: '#111827'
                      }}>{store.licenseNumber}</td>
                      <td style={{ 
                        padding: '16px 24px',
                        textAlign: 'left',
                        color: '#111827'
                      }}>{store.name}</td>
                      <td style={{ 
                        padding: '16px 24px',
                        textAlign: 'center'
                      }}>
                        <input 
                          type="checkbox"
                          checked={(ICLApp?.selectedStores || []).includes(store.id)}
                          onChange={() => handleStoreSelect(store.id)}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: 'pointer'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {ICLApp?.ApplicantType === '02' && ICLApp?.OnBehalf && (
          <>
            <div className="grid grid-col-2" style={{ marginTop: '20px' }}>
              <div
                data-aos="fade-right"
                className="field-container"
                style={{ gridColumn: 1, gridRow: 1 }}
              >
                <label htmlFor="commercial-register" className="required">
                  Commercial Registration No.
                </label>
                <input
                  type="text"
                  id="commercial-register"
                  name="commercial-register"
                  className={`select-tag ${errors?.RegInfo ? 'input-error' : ''}`}
                  value={ICLApp?.RegInfo?.commercial_record || ''}
                  onChange={handleCommercialRegisterationNo}
                />
                {errors?.RegInfo?._errors && (
                  <p className="error-msg">{errors.RegInfo._errors[0]}</p>
                )}
              </div>
            </div>

            {typing && <LoadingBar gridCol="span 2" gridRow="2" />}
 {errors?.selectedStores && (
              <p className="error-msg error-bg">{errors.selectedStores._errors[0]}</p>
            )}
            {ICLApp?.RegInfo?.Show && (
              
              <div style={{ 
                width: '100%', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: '20px'
              }}>
              
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  backgroundColor: 'white'
                }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: '#17406d',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#ffff'
                    }}>
                      <th style={{ 
                        padding: '12px 24px', 
                        textAlign: 'left',
                        color: '#ffff',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>License Number</th>
                      <th style={{ 
                        padding: '12px 24px', 
                        textAlign: 'left',
                        color: '#ffff',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>Store Name</th>
                      <th style={{ 
                        padding: '12px 24px', 
                        width: '80px',
                        textAlign: 'center'
                      }}>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map(store => (
                      <tr 
                        key={store.id}
                        style={{ 
                          borderBottom: '1px solid #e5e7eb',
                          backgroundColor: (ICLApp?.selectedStores || []).includes(store.id) 
                            ? '#f3f4f6' 
                            : 'white'
                        }}
                      >
                        <td style={{ 
                          padding: '16px 24px',
                          textAlign: 'left',
                          color: '#111827'
                        }}>{store.licenseNumber}</td>
                        <td style={{ 
                          padding: '16px 24px',
                          textAlign: 'left',
                          color: '#111827'
                        }}>{store.name}</td>
                        <td style={{ 
                          padding: '16px 24px',
                          textAlign: 'center'
                        }}>
                          <input 
                            type="checkbox"
                            checked={(ICLApp?.selectedStores || []).includes(store.id)}
                            onChange={() => handleStoreSelect(store.id)}
                            style={{
                              width: '16px',
                              height: '16px',
                              cursor: 'pointer'
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </form>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg" onClick={showModal}>
          Cancel
        </Button>
        <Button variant="primary" size="lg">
          Save Draft
        </Button>
        <Button variant="primary" size="lg" onClick={handleNextAction}>
          Next
          <Image
            src="/images/next.webp"
            alt="Profile"
            width={15}
            height={15}
            className="profile-image"
          />
        </Button>
      </div>
    </div>
  )
}

export default Applicant