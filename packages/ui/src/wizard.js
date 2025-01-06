'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import useStore from './shared-store/store'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Wizard = ({ steps, title }) => {
  const { currentStep } = useStore()

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      offset: 50
    })
  }, [])

  return (
    <div className="wizard-container">
      <div className="wizard-steps">
        {steps.map(({ step, name }) => (
          <div
            key={step}
            className={`wizard-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
            data-step={step}
          >
            <div className="step-icon">
              {currentStep > step ? (
                <Image
                  src="/images/MdiCheck.webp"
                  alt="Check Image"
                  width={32}
                  height={32}
                />
              ) : (
                step
              )}
            </div>
            <p>{name}</p>
          </div>
        ))}
      </div>
      <div className="main-container">
        <h2 className="wizard-title">{title}</h2>
        {steps[currentStep - 1].component}
      </div>
    </div>
  )
}

export default Wizard
