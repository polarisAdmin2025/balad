'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { Button } from '../button'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'
import { cclCommercialSchema } from '../util/zod'

const CommercialActivity = () => {
  const { isOpen, showModal, closeModal } = useModal()
  const { ICLApp, currentStep, setCurrentStep, setICLApp } = useStore()
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState({})
  const router = useRouter()

  // Cancellation reasons
  const cancellationReasons = [
    { code: '01', name: 'Changing the location of the store' },
    { code: '02', name: 'Violations and fines' },
    { code: '03', name: 'High fees' },
    { code: '04', name: 'Other' }
  ]

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => setLoading(false), 500)
  }, [])

  const handleCancel = () => {
    router.push('/')
  }

  const handleNextAction = () => {
    const validationResult = cclCommercialSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
      return
    }
    setErrors({})
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
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
            data-aos-delay="150"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="store-name">Store Name</label>
            <input
              name="store-name"
              id="store-name"
              className="select-tag"
              value={ICLApp?.StoreName || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            <label htmlFor="store-number">Store Number</label>
            <input
              name="store-number"
              id="store-number"
              className="select-tag"
              value={ICLApp?.StoreNum || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="250"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <label htmlFor="property-number">Property Number</label>
            <input
              name="property-number"
              id="property-number"
              className="select-tag"
              value={ICLApp?.PropertyNum || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="300"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            <label htmlFor="floors-number">Floors Number</label>
            <input
              name="floors-number"
              id="floors-number"
              className="select-tag"
              value={ICLApp?.FloorsNum || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="350"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            <label htmlFor="entrances-number">Entrances Number</label>
            <input
              name="entrances-number"
              id="entrances-number"
              className="select-tag"
              value={ICLApp?.EntrancesNum || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="400"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 3 }}
          >
            <label htmlFor="store-area">Store Area</label>
            <input
              name="store-area"
              id="store-area"
              className="select-tag"
              value={ICLApp?.StoreArea || ''}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="450"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 4 }}
          >
            <label htmlFor="cancellation-reason" className="required">Reason for cancellation</label>
            <select
              name="cancellation-reason"
              id="cancellation-reason"
              className={`select-tag ${errors?.cancellationReason ? 'input-error' : ''}`}
              value={ICLApp?.cancellationReason || ''}
              onChange={(e) => setICLApp('cancellationReason', e.target.value)}
            >
              <option value="">Select a reason</option>
              {cancellationReasons.map(reason => (
                <option key={reason.code} value={reason.code}>
                  {reason.name}
                </option>
              ))}
            </select>
            {errors?.cancellationReason && (
              <p className="error-msg">{errors.cancellationReason._errors[0]}</p>
            )}
          </div>
        </div>
      </form>
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

export default CommercialActivity