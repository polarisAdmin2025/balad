'use client'
import useStore from './shared-store/store'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import { Button } from './button'
import { getAction, postAction } from './util/actions'

const Attachments = () => {
  const { currentStep, setCurrentStep, ICLApp, setICLApp } = useStore()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState({})
  const [errors, setErrors] = useState({})
  const fileInputRefs = useRef({})

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getAction('/attachment/service_attachment/?service_code=01')
        if (response) {
          setDocuments(response)
          
          // Restore files from ICLApp state if they exist
          if (ICLApp?.attachments) {
            const restoredFiles = {}
            Object.entries(ICLApp.attachments).forEach(([docId, fileData]) => {
              if (fileData) {
                restoredFiles[docId] = {
                  file: fileData.file,
                  url: URL.createObjectURL(fileData.file),
                  typeCode: fileData.typeCode
                }
              }
            })
            setFiles(restoredFiles)
          }
        }
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()

    // Cleanup URLs when component unmounts
    return () => {
      Object.values(files).forEach(file => {
        if (file.url) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [])

  const validateFile = (file, doc) => {
    const errors = []
    
    // Size validation
    if (file.size > doc.max_size_mb * 1024 * 1024) {
      errors.push(`File size must be less than ${doc.max_size_mb}MB`)
    }

    // Extension validation
    const fileExt = file.name.split('.').pop().toLowerCase()
    const allowedExts = doc.allowed_extensions.split(',').map(ext => ext.trim().toLowerCase())
    if (!allowedExts.includes(fileExt)) {
      errors.push(`File type must be one of: ${doc.allowed_extensions}`)
    }

    return errors
  }

  const handleButtonClick = (docId) => {
    fileInputRefs.current[docId]?.click()
  }

  const handleFileChange = (docId, e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const doc = documents.find(d => d.id === docId)
      const validationErrors = validateFile(selectedFile, doc)

      if (validationErrors.length > 0) {
        setErrors(prev => ({
          ...prev,
          [docId]: validationErrors
        }))
        return
      }

      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[docId]
        return newErrors
      })

      // Store file info in files state for UI
      setFiles(prev => ({
        ...prev,
        [docId]: {
          file: selectedFile,
          url: URL.createObjectURL(selectedFile),
          typeCode: doc.code
        }
      }))

      // Store file info in ICLApp
      setICLApp('attachments', {
        ...ICLApp?.attachments,
        [docId]: {
          file: selectedFile,
          typeCode: doc.code,
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        }
      })
    }
  }

  const handleNextAction = async () => {
    console.warn(ICLApp.attachments)
    const missingRequired = documents
      .filter(doc => doc.is_required)
      .some(doc => !files[doc.id])

    if (missingRequired) {
      alert('Please upload all required documents')
      return
    }

    try {
      const uploadPromises = Object.values(files).map(async (fileData) => {
        const formData = new FormData()
        formData.append('file', fileData.file)
        formData.append('draft_number', ICLApp.draft_number)
        
        return postAction('/eservice/attachments/', formData)
      })

      await Promise.all(uploadPromises)
      setCurrentStep(currentStep + 1)
    } catch (error) {
      console.error('Error uploading files:', error)
      alert('Error uploading files. Please try again.')
    }
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleViewFile = (docId) => {
    if (files[docId]?.url) {
      window.open(files[docId].url, '_blank')
    }
  }

  const handleDeleteFile = (docId) => {
    // Remove from files state
    setFiles(prev => {
      const newFiles = { ...prev }
      if (newFiles[docId]?.url) {
        URL.revokeObjectURL(newFiles[docId].url)
      }
      delete newFiles[docId]
      return newFiles
    })

    // Remove from ICLApp state
    setICLApp('attachments', {
      ...ICLApp?.attachments,
      [docId]: undefined
    })

    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[docId]
      return newErrors
    })
  }

  if (loading) {
    return <div className="content-container">Loading documents...</div>
  }

  return (
    <div className="content-container">
      <div className="flex-wrap" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
        {documents.map((doc) => (
          <div key={doc.id} className={files[doc.id] ? 'Uploades' : 'att-container'}>
            <Image
              src={files[doc.id] ? '/images/uploadedDone.webp' : '/images/Attachment.webp'}
              alt="Attachment icon"
              width={85}
              height={85}
            />
            <p>{files[doc.id] ? files[doc.id].file.name : doc.english_name}</p>
            <p>{doc.allowed_extensions}</p>
            <p>{doc.max_size_mb} MB</p>
            {errors[doc.id] && (
              <div className="error-msg">
                {errors[doc.id].map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <input
              ref={el => fileInputRefs.current[doc.id] = el}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(doc.id, e)}
              accept={doc.allowed_extensions.split(',').map(ext => `.${ext.trim()}`).join(',')}
            />
            <div className="flex gap-xsmall">
              <Image
                src="/images/Upload.webp"
                alt="Upload"
                width={25}
                height={25}
                onClick={() => handleButtonClick(doc.id)}
                style={{ cursor: 'pointer' }}
              />
              {files[doc.id] && (
                <>
                  <Image
                    src="/images/Eye.webp"
                    alt="View"
                    width={25}
                    height={25}
                    onClick={() => handleViewFile(doc.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  <Image
                    src="/images/Trash.webp"
                    alt="Delete"
                    width={25}
                    height={25}
                    onClick={() => handleDeleteFile(doc.id)}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg">
          Cancel
        </Button>
        <Button variant="primary" size="lg" onClick={handlePreviousAction}>
          <Image
            src="/images/previous.webp"
            alt="Previous"
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