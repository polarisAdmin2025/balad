'use client'

import { useState } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { Button } from '../button'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./map'), { ssr: false })

const GeoLocation = () => {
  const { currentStep, setCurrentStep } = useStore()
  const { isOpen, showModal, closeModal } = useModal()
  const router = useRouter()

  // Predefined location data
  const locationData = {
    city: 'Amman',
    area: 'Abdoun',
    district: 'Abdoun Circle',
    street: 'Abdoun Circle Street',
    municipality: 'Greater Amman Municipality',
    secretariat: 'Amman',
    neighborhood: 'Abdoun Al Shamali',
    schemeNumber: '123',
    landNumber: '456',
    coordinates: {
      lat: 31.9539,  // Abdoun Circle coordinates
      lng: 35.8839
    }
  }

  const handleNextAction = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCancel = () => {
    router.push('/')
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
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleCancel}>
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
            <label>Area</label>
            <input 
              className="select-tag" 
              value={locationData.area}
              disabled 
            />
          </div>
          <div
            style={{ 
              gridColumn: 2, 
              gridRow: 'span 7',
              height: '500px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            <Map 
              readOnly={true}
              initialPosition={locationData.coordinates}
              initialZoom={16}
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <label>Municipality</label>
            <input
              className="select-tag"
              value={locationData.municipality}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            <label>Secretariat</label>
            <input
              className="select-tag"
              value={locationData.secretariat}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 4 }}
          >
            <label>Neighborhood</label>
            <input
              className="select-tag"
              value={locationData.neighborhood}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 5 }}
          >
            <label>Street</label>
            <input 
              className="select-tag" 
              value={locationData.street}
              disabled 
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 6 }}
          >
            <label>Scheme Number</label>
            <input
              className="select-tag"
              value={locationData.schemeNumber}
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 7 }}
          >
            <label>Land Number</label>
            <input 
              className="select-tag"
              value={locationData.landNumber}
              disabled
            />
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

export default GeoLocation