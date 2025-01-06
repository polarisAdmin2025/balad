'use client'
import useStore from './shared-store/store'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Button } from './button'

const Attachments = () => {
  const { currentStep, setCurrentStep } = useStore()
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [fileUrl, setFileUrl] = useState(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }
  const handleFileChange = e => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleNextAction = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleViewFile = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    }
  }
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl)
      }
    }
  }, [fileUrl])

  return (
    <div
      data-aos="fade-right"
      data-aos-delay="0"
      style={{ gridColumn: 1, gridRow: 1 }}
    >
      <div className="content-container flex-J-center gap-75 ">
        <div className={!file ? 'att-container' : 'Uploades'}>
          <Image
            src={file ? '/images/uploadedDone.webp' : '/images/Attachment.webp'}
            alt="Attachment.webp logo"
            width={85}
            height={85}
          />
          <p> {!file ? 'Commercial Register' : file.name}</p>
          <p>PNG,JPEG,PDF</p>
          <p>5 MB</p>
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="flex gap-xsmall">
            <Image
              src="/images/Upload.webp"
              alt="Attachment.webp logo"
              width={25}
              height={25}
              onClick={handleButtonClick}
            />
            {!file ? (
              ' '
            ) : (
              <Image
                src="/images/Eye.webp"
                alt="Show Attachment"
                width={25}
                height={25}
                onClick={handleViewFile}
              />
            )}
            {!file ? (
              ' '
            ) : (
              <Image
                src="/images/Trash.webp"
                alt="trash.webp logo"
                width={25}
                height={25}
                onClick={() => setFile(null)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg">
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
export default Attachments
