'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { Button } from '../button'
import { postAction, patchAction ,deleteAction } from '../util/actions'
import { useRouter } from 'next/navigation'
import Modal from '../modal/modal'
import { feesSchema } from '../util/zod'

const Fees = () => {
  const { currentStep, setCurrentStep, ICLApp, setICLApp } = useStore()
  const [loading, setLoading] = useState(true)
  const [feesData, setFeesData] = useState(null)
  const { isOpen, showModal, closeModal } = useModal()
  const [error, setError] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const router = useRouter()

  useEffect(() => {
    const fetchFees = async () => {
        // if(!ICLApp?.fees){
      try {
        if (!ICLApp?.draft_number) {
          throw new Error('Draft number is required')
        }

        const response = await postAction('/payment/calculate-fees/', {
          draft_number: ICLApp.draft_number
        })
        
        if (!response) {
          throw new Error('No data received from server')
        }
 
        // Store fees data in ICLApp
        setICLApp('fees', {
          MainActivity: response.fee[0].amount,
          ShopAreaFees: response.fee[1].amount,
          BoardsFees:response.fee[2].amount,
          totalAmount: response.total_amount
        })

        setFeesData(response)
        setError(null)

      } catch (error) {
        console.error('Error fetching fees:', error)
        setError('Failed to load fees data. Please try again.')

      } finally {
        setLoading(false)
      }
  
       setLoading(false)
    }

    fetchFees()
    
  }, [ICLApp?.draft_number, setICLApp])

  const handleNextAction = async () => {
    try {
      // Format phone number to ensure it has +962 prefix
      const phoneToValidate = ICLApp.phone?.startsWith('+962') 
        ? ICLApp.phone 
        : `+962${ICLApp.phone?.replace(/^962/, '')}`

      // Validate contact information
      const validationResult = feesSchema.safeParse({
        phone: phoneToValidate,
        email: ICLApp.email
      })

      if (!validationResult.success) {
        const formattedErrors = validationResult.error.format()
        setValidationErrors({
          phone: formattedErrors.phone?._errors[0],
          email: formattedErrors.email?._errors[0]
        })
        return
      }

      setValidationErrors({})

      // Prepare the data object according to the API requirements
      const submitData = {
        mobile_number: phoneToValidate,
        email: ICLApp.email
      }

      // Call the submit draft API
      await patchAction(`/eservice/submit-draft/${ICLApp.draft_number}/`, submitData)
      
      // Show success modal
      setShowSuccess(true)
    } catch (error) {
      console.error('Error submitting draft:', error)
      setError('Failed to submit draft. Please try again.')
    }
  }

  const handlePreviousAction = async () => {
      try {
         await deleteAction('/payment/get-fees/', {
          draft_number: ICLApp.draft_number
        })
      } catch (error) {
        setError('Failed to load fees data. Please try again.')
        console.error('Error fetching fees:', error)

      } finally {
        setLoading(false)
      }
    setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    router.push('/')
  }

  const handlePhoneChange = (e) => {
    let value = e.target.value

    // Allow only numbers
    if (!/^[0-9]*$/.test(value)) {
      return
    }

    // Store raw phone number
    setICLApp('phone', value)
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({...prev, phone: null}))
  }

  const handleEmailChange = (e) => {
    setICLApp('email', e.target.value)
    // Clear validation error when user starts typing
    setValidationErrors(prev => ({...prev, email: null}))
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    router.push('/services')
  }

  if (loading) {
    return <div className="content-container">Loading fees...</div>
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

      {showSuccess && (
        <Modal>
          <Modal.Title closeModal={handleSuccessClose}>Success</Modal.Title>
          <Modal.Content>
            The application was successfully sent
          </Modal.Content>
          <Modal.Footer>
            <Button onClick={handleSuccessClose}>OK</Button>
          </Modal.Footer>
        </Modal>
      )}

      <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
        <h3>Fees Details</h3>
      </div>
      <div className="fees-container">
        <div className="fees-items-container grid grid-col-2">
          {feesData?.fee?.map((feeItem, index) => (
            <>
              <div
                key={`desc-${index}`}
                data-aos="fade-right"
                data-aos-delay="0"
                style={{ gridColumn: 1, gridRow: index + 1 }}
              >
                {feeItem.description_english}
              </div>
              <div
                key={`amount-${index}`}
                data-aos="fade-right"
                data-aos-delay="0"
                style={{ gridColumn: 2, gridRow: index + 1 }}
              >
                {feeItem.amount} {feesData.currency}
              </div>
            </>
          ))}
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 1, gridRow: feesData?.fee?.length + 1 }}
          >
            Total
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: feesData?.fee?.length + 1 }}
          >
            {feesData?.total_amount} {feesData?.currency}
          </div>
        </div>
      </div>
      <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
        <h3>Contact Details</h3>
      </div>
      <div className="grid grid-col-2">
        <div
          data-aos="fade-right"
          data-aos-delay="0"
          className="field-container"
          style={{ gridColumn: 1, gridRow: 1 }}
        >
          <label htmlFor="phone">Phone Number</label>
          <input 
            name="phone" 
            id="phone" 
            className={`select-tag ${validationErrors?.phone ? 'input-error' : ''}`}
            value={ICLApp?.phone || ''}
            onChange={handlePhoneChange}
            placeholder="7XXXXXXXX"
          />
          {validationErrors?.phone && (
            <p className="error-msg">{validationErrors.phone}</p>
          )}
        </div>
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          className="field-container"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          <label htmlFor="email">Email</label>
          <input 
            name="email" 
            id="email" 
            className={`select-tag ${validationErrors?.email ? 'input-error' : ''}`}
            value={ICLApp?.email || ''}
            onChange={handleEmailChange}
            type="email"
          />
          {validationErrors?.email && (
            <p className="error-msg">{validationErrors.email}</p>
          )}
        </div>
      </div>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg" onClick={showModal}>
          Cancel
        </Button>
        <Button variant="primary" size="lg" onClick={handlePreviousAction}>
          <Image
            src="/images/previous.webp"
            alt="Profile"
            width={15}
            height={15}
            className="profile-image"
          />
          <p>Previous</p>
        </Button>
        <Button variant="primary" size="lg">
          Save Draft
        </Button>
        <Button variant="primary" size="lg" onClick={handleNextAction}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export default Fees