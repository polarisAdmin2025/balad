'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { getAction, patchAction } from '../util/actions'
import { Button } from '../button'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'
import { geoLocationSchema } from '../util/zod'

const GeoLocation = () => {
  const { ICLApp, setICLApp, currentStep, setCurrentStep } = useStore()
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const { isOpen, showModal, closeModal } = useModal()
  const router = useRouter()
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchApplicantType = async () => {
      try {
        const citiesResponse = await getAction('/admin-config/cities/')
        setConfig({
          cities: citiesResponse
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching applicant type:', error)
      }
    }
    fetchApplicantType()
  }, [])

  const handleNextAction = () => {
    const validationResult = geoLocationSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
    } else {
      setErrors({})
      const appData = {
        city_code: ICLApp.City,
        region_code: ICLApp.region,
        neighborhood_code: ICLApp.neighborhood,
        street: ICLApp.Street
      }
      console.warn(appData)
      patchAction(`/eservice/draft/${ICLApp.draft_number}/`, appData)
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleCityChange = async e => {
    setICLApp('City', e.target.value)
    if (e.target.value) {
      const city_code =e.target.value
      const regions = await getAction(
        `/admin-config/regions/?city_code=${city_code}`
      )
      setICLApp('regions', regions)
    } else {
      setICLApp('regions', [])
      setICLApp('neighborhoods', [])
    }
    setICLApp('region', '')
    setICLApp('neighborhood', '')
  }

  const handleRegionChange = async e => {
    setICLApp('region', e.target.value)
    if (e.target.value) {
      const region_code = e.target.value
      const neighborhoods = await getAction(
        `/admin-config/neighborhoods/?region_code=${region_code}`
      )
      setICLApp('neighborhoods', neighborhoods)
    } else {
      setICLApp('neighborhoods', [])
    }
    setICLApp('neighborhood', '')
  }

  const handleCancel = () => {
    router.push('/')
  }
  const handleneighborhoodsChange = e => {
    setICLApp('neighborhood', e.target.value)
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
            data-aos-delay="0"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="city" className="required">
              City
            </label>
            <select
              name="city"
              id="city"
              className={`select-tag ${errors?.City ? 'input-error' : ''}`}
              value={ICLApp?.City}
              onChange={handleCityChange}
            >
              <option value="">--Select City--</option>
              {config?.cities?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
                </option>
              ))}
            </select>
            {errors.City && (
              <p className="error-msg">{errors.City._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="50"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            <label htmlFor="area" className="required">
              Area
            </label>
            <select
              name="area"
              id="area"
              className={`select-tag ${errors?.region ? 'input-error' : ''}`}
              value={ICLApp?.region}
              onChange={handleRegionChange}
            >
              <option value="">--Select Area--</option>
              {ICLApp?.regions?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="error-msg">{errors.region._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="100"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <label htmlFor="district" className="required">
              District
            </label>
            <select
              name="district"
              id="district"
              className={`select-tag ${errors?.neighborhood ? 'input-error' : ''}`}
              value={ICLApp?.neighborhood}
              onChange={handleneighborhoodsChange}
            >
              <option value="">--Select District--</option>
              {ICLApp?.neighborhoods?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
                </option>
              ))}
            </select>
            {errors.neighborhood && (
              <p className="error-msg">{errors.neighborhood._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            <label htmlFor="street">Street</label>
            <input
              name="street"
              id="street"
              className={`select-tag ${errors?.Street ? 'input-error' : ''}`}
              value={ICLApp?.Street || ''}
              onChange={e => {
                setICLApp('Street', e.target.value)
              }}
            />
            {errors.Street && (
              <p className="error-msg">{errors.Street._errors[0]}</p>
            )}
          </div>
        </div>
        <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
          <h3>Location</h3>
        </div>

        <div className="grid grid-col-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3383.5875422080762!2d35.82708997386269!3d31.9991948233325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1f58fe4b541%3A0x115e2a5b3f966a9a!2sAl%20Rahmanyeh%2C%20Amman!5e0!3m2!1sen!2sjo!4v1732182770466!5m2!1sen!2sjo"
            width="100%"
            height="100%"
            style={{ border: 0, gridColumn: 2, gridRow: 'span 7' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          >
            {''}
          </iframe>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="Area">Area</label>
            <input name="Area" id="Area" className="select-tag" disabled />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <label htmlFor="Municipality">Municipality</label>
            <input
              name="Municipality"
              id="Municipality"
              className="select-tag"
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            <label htmlFor="Secretariat">Secretariat</label>
            <input
              name="Secretariat"
              id="Secretariat"
              className="select-tag"
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 4 }}
          >
            <label htmlFor="Neighborhood">Neighborhood</label>
            <input
              name="Neighborhood"
              id="Neighborhood"
              className="select-tag"
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 5 }}
          >
            <label htmlFor="Street">Street</label>
            <input name="Street" id="Street" className="select-tag" disabled />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 6 }}
          >
            <label htmlFor="Scheme-Number">Scheme Number</label>
            <input
              name="Scheme-Number"
              id="Scheme-Number"
              className="select-tag"
              disabled
            />
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 7 }}
          >
            <label htmlFor="Land-Number">Land Number</label>
            <input name="Land-Number" id="Land-Number" className="select-tag" />
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