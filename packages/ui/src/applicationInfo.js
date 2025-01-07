'use client'

import { useEffect, useState } from 'react'
import useStore from './shared-store/store'
import Image from 'next/image'
import { getAction, postAction } from './util/actions'
import ApplicationInfoSkeleton from './skeletons/application-info-skeleton'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import { useRouter } from 'next/navigation'
import { Button } from './button'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

const ApplicationInfo = () => {
  const {
    currentSubStep,
    currentStep,
    setCurrentStep,
    setCurrentSubStep,
    ICLApp,
    setICLApp
  } = useStore()
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState()
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServicePre = async () => {
      setICLApp('service_code', '01')
      try {
        const response = await getAction(
          '/admin-config/services-prerequisite/?service_code=01'
        )
        if (response instanceof Error) {
          setError(response)
        } else {
          setConfig(response)
        }
        setLoading(false)
      } catch (error) {
        setError(error)
        console.error('Error fetching applicant type:', error)
        setLoading(false)
      }
    }
    fetchServicePre()
  }, [])

  const handleCancel = () => {
    router.push('/')
  }

  if (error) {
    throw error
  }

  if (loading || !config) {
    return <ApplicationInfoSkeleton />
  }

  const handleNextAction = () => {
    if (currentSubStep === 4) {
      const createApplication = async () => {
        try {
          const applicationNumber = await postAction('/eservice/draft/', ICLApp)
          setICLApp('draft_number', applicationNumber.draft_number)
          console.warn(applicationNumber)
          setCurrentStep(currentStep + 1)
        } catch (error) {
          setConfig(error)
          console.error('Error in create application:', error)
        }
      }
      createApplication()
    } else {
      setCurrentSubStep(currentSubStep + 1)
    }
  }

  const handlePreviousAction = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1)
    }
  }

  return (
    <div className="content-container">
      <div className="form-content">
        <div
          data-aos="fade-right"
          data-aos-delay="0"
          data-aos-mirror="true"
          className="flex-center tabs"
        >
          <div className={`tab-highlight-${currentSubStep}`}>{''}</div>
          {config?.map((item, index) => (
            <h3
              key={item.id}
              className={currentSubStep === index + 1 ? 'active' : ''}
            >
              {item.english_title}
            </h3>
          ))}
        </div>
        <ReactQuill
          value={config[currentSubStep - 1]?.english_content || ''}
          readOnly={true}
          theme="bubble"
          modules={{ toolbar: false }}
          style={{ fontWeight: 'normal' }}
        />
      </div>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg" onClick={handleCancel}>
          Cancel
        </Button>
        {currentSubStep !== 1 && (
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
        )}
        <Button variant="primary" size="lg" onClick={handleNextAction}>
          {currentStep === 1 && currentSubStep === 4 ? (
            'Start'
          ) : (
            <>
              <span>Next</span>
              <Image
                src="/images/next.webp"
                alt="Profile"
                width={15}
                height={15}
                className="profile-image"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default ApplicationInfo
