'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { getAction, patchAction } from '../util/actions'
import { Button } from '../button'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'
import { geoLocationSchema } from '../util/zod'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./map'), { ssr: false })

const GeoLocation = () => {
  const { ICLApp, setICLApp, currentStep, setCurrentStep } = useStore()
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const { isOpen, showModal, closeModal } = useModal()
  const router = useRouter()
  const [errors, setErrors] = useState({})
  const [locationDetails, setLocationDetails] = useState({
    area: '',
    municipality: '',
    secretariat: '',
    neighborhood: '',
    street: '',
    schemeNumber: '',
    landNumber: ''
  })
  const [selectedArea, setSelectedArea] = useState(null)

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
      const city_code = e.target.value
      const regions = await getAction(
        `/admin-config/regions/?city_code=${city_code}`
      )
      setICLApp('regions', regions)
      setSelectedArea(null) // Reset selected area when city changes
    } else {
      setICLApp('regions', [])
      setICLApp('neighborhoods', [])
      setSelectedArea(null)
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
      
      // Get area boundaries and update map
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${e.target.selectedOptions[0].text},Jordan&format=json&polygon_geojson=1`
        )
        const data = await response.json()
        if (data && data[0]) {
          setSelectedArea({
            name: e.target.selectedOptions[0].text,
            bounds: data[0].boundingbox,
            geojson: data[0].geojson
          })
        }
      } catch (error) {
        console.error('Error fetching area boundaries:', error)
      }
    } else {
      setICLApp('neighborhoods', [])
      setSelectedArea(null)
    }
    setICLApp('neighborhood', '')
  }

  const handleCancel = () => {
    router.push('/')
  }

  const handleneighborhoodsChange = async e => {
    setICLApp('neighborhood', e.target.value)
    if (e.target.value) {
      // Get neighborhood boundaries and update map
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${e.target.selectedOptions[0].text},Jordan&format=json&polygon_geojson=1`
        )
        const data = await response.json()
        if (data && data[0]) {
          setSelectedArea({
            name: e.target.selectedOptions[0].text,
            bounds: data[0].boundingbox,
            geojson: data[0].geojson
          })
        }
      } catch (error) {
        console.error('Error fetching neighborhood boundaries:', error)
      }
    }
  }

  const handlePositionSelect = async position => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&addressdetails=1&accept-language=ar&zoom=18`
      )
      const data = await response.json()
      
      const details = {
        area: data.address.suburb || 
              data.address.neighbourhood || 
              data.address.quarter ||
              data.address.residential ||
              '',
        municipality: data.address.municipality ||
                     data.address.city_district ||
                     data.address.town ||
                     data.address.city ||
                     '',
        secretariat: data.address.state_district ||
                    data.address.state ||
                    data.address.region ||
                    '',
        neighborhood: data.address.neighbourhood ||
                     data.address.suburb ||
                     data.address.quarter ||
                     '',
        street: data.address.road ||
                data.address.street ||
                data.address.footway ||
                '',
        schemeNumber: data.address.postcode ||
                     data.address.postal_code ||
                     '',
        landNumber: ''
      }
      
      setLocationDetails(details)
      
    } catch (error) {
      console.error('Error fetching location details:', error)
      setLocationDetails({
        area: '',
        municipality: '',
        secretariat: '',
        neighborhood: '',
        street: '',
        schemeNumber: '',
        landNumber: ''
      })
    }
  }

  const handleLandNumberChange = (e) => {
    const newDetails = {
      ...locationDetails,
      landNumber: e.target.value
    }
    setLocationDetails(newDetails)
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
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="Area">Area</label>
            <input 
              name="Area" 
              id="Area" 
              className="select-tag" 
              value={locationDetails.area}
              disabled 
            />
          </div>
          <div
            style={{ 
              gridColumn: 2, 
              gridRow: 'span 7',
              height: '500px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
          >
            <Map onPositionSelect={handlePositionSelect} selectedArea={selectedArea} />
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
              value={locationDetails.municipality}
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
              value={locationDetails.secretariat}
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
              value={locationDetails.neighborhood}
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
            <input 
              name="Street" 
              id="Street" 
              className="select-tag" 
              value={locationDetails.street}
              disabled 
            />
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
              value={locationDetails.schemeNumber}
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
            <input 
              name="Land-Number" 
              id="Land-Number" 
              className="select-tag"
              value={locationDetails.landNumber}
              onChange={handleLandNumberChange}
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