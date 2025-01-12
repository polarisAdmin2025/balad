'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { Button } from '../button'
import { postAction } from '../util/actions'
import { useRouter } from 'next/navigation'
import Modal from '../modal/modal'

const Fees = () => {
  const { currentStep, setCurrentStep, ICLApp } = useStore()
  const [loading, setLoading] = useState(true)
  const [feesData, setFeesData] = useState(null)
  const { isOpen, showModal, closeModal } = useModal()
  const router = useRouter()

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await postAction('/payment/calculate-fees/', {
          draft_number: ICLApp.draft_number
        })
        setFeesData(response)
      } catch (error) {
        console.error('Error fetching fees:', error)
      } finally {
        setLoading(false)
      }
    }

    if (ICLApp?.draft_number) {
      fetchFees()
    }
  }, [ICLApp?.draft_number])

  const handleNextAction = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    router.push('/')
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
      <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
        <h3>Fees Details</h3>
      </div>
      <div className="fees-container">
        <div className="fees-items-container grid grid-col-2">
          {feesData?.fee.map((feeItem, index) => (
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
            style={{ gridColumn: 1, gridRow: feesData?.fee.length + 1 }}
          >
            Total
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: feesData?.fee.length + 1 }}
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
          <label htmlFor="phone">Phone</label>
          <input name="phone" id="phone" className="select-tag"  />
        </div>
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          className="field-container"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          <label htmlFor="email">Email</label>
          <input name="email" id="email" className="select-tag"  />
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