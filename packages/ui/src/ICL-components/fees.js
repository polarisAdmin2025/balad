'use client'
import useStore from '../shared-store/store'
import Image from 'next/image'

const Fees = () => {
  const { currentStep, setCurrentStep } = useStore()

  const handleNextAction = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="content-container ">
      <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
        <h3>Fees Details</h3>
      </div>
      <div className="fees-container">
        <div className="fees-items-container grid grid-col-2">
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            Activity Type
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            xxxxxxx
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            Board size
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            xxxxxx
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            Store Space
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: 3 }}
          >
            xxxxxxx
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 1, gridRow: 4 }}
          >
            Total
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            style={{ gridColumn: 2, gridRow: 4 }}
          >
            xxxxxxx
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
          <input name="phone" id="phone" className="select-tag" disabled />
        </div>
        <div
          data-aos="fade-right"
          data-aos-delay="50"
          className="field-container"
          style={{ gridColumn: 2, gridRow: 1 }}
        >
          <label htmlFor="email">Email</label>
          <input name="email" id="email" className="select-tag" disabled />
        </div>
      </div>
      <div className="wizard-buttons">
        <button>Cancel</button>
        <button onClick={handlePreviousAction}>
          <Image
            src="/images/previous.webp"
            alt="Profile"
            width={15}
            height={15}
            className="profile-image"
          />
          <p>Previous</p>
        </button>
        <button>Save Draft</button>
        <button onClick={handleNextAction}>Submit</button>
      </div>
    </div>
  )
}

export default Fees
