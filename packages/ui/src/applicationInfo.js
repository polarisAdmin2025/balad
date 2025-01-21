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
  const [config, setConfig] = useState(null)
  const router = useRouter()
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const fetchServicePre = async () => {
      try {
        const response = await getAction(
          `/admin-config/services-prerequisite/?service_code=${ICLApp.service_code}`
        )
        if (!mounted) return

        if (response.error) {
          throw new Error(response.error)
        }
        
        setConfig(response)
        // Set currentSubStep to 1 initially when data is loaded
        setCurrentSubStep(1)
      } catch (error) {
        if (mounted) {
          setError(error)
          console.error('Error fetching service prerequisites:', error)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchServicePre()

    return () => {
      mounted = false
    }
  }, [setICLApp, setCurrentSubStep])

  const handleCancel = () => {
    router.push('/')
  }

  if (error) {
    return <div className="error-msg">Error loading service prerequisites</div>
  }

  if (loading || !config) {
    return <ApplicationInfoSkeleton />
  }

  const handleNextAction = async () => {
    try {
      if (currentSubStep === config.length) {
        const response = await postAction('/eservice/draft/', ICLApp)
        if (response.error) {
          throw new Error(response.error)
        }
        setICLApp('draft_number', response.draft_number)
        setCurrentStep(currentStep + 1)
      } else {
        setCurrentSubStep(currentSubStep + 1)
      }
    } catch (error) {
      setError(error)
      console.error('Error:', error)
    }
  }

  const handlePreviousAction = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(currentSubStep - 1)
    }
  }

  // Calculate dynamic styles for tabs and highlight
  const tabWidth = config ? `${100 / config.length}%` : '25%'
  const highlightTransform = `translateX(${(currentSubStep - 1) * 100}%)`

  return (
    <div className="content-container">
      <div className="form-content">
        <div
          data-aos="fade-right"
          data-aos-delay="0"
          data-aos-mirror="true"
          className="flex-center tabs"
          style={{ position: 'relative' }}
        >
          <div 
            style={{
              position: 'absolute',
              height: '44px',
              width: tabWidth,
              backgroundColor: 'var(--color-primary-bg)',
              left: 0,
              borderStartStartRadius: '25px',
              borderStartEndRadius: '25px',
              transform: highlightTransform,
              transition: 'transform 0.3s ease-in-out'
            }}
          />
          {config?.map((item, index) => (
            <h3
              key={item.id}
              className={currentSubStep === index + 1 ? 'active' : ''}
              style={{ flex: `0 0 ${tabWidth}` }}
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
          {currentStep === 1 && currentSubStep === config.length ? (
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