'use client'

import { useEffect, useRef, useState } from 'react'
import useStore, { useModal } from '../shared-store/store'
import { applicantSchema } from '../util/zod'
import Image from 'next/image'
import { getAction, patchAction, postAction } from '../util/actions'
import TwoColSkeleton from '../skeletons/two-col-skeleton'
import LoadingBar from '../skeletons/loading-bar'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'
import { Button } from '../button'

const Applicant = () => {
  const { ICLApp, setICLApp, currentStep, setCurrentStep } = useStore()
  const { isOpen, showModal, closeModal } = useModal()
  const [errors, setErrors] = useState({})
  const typingTimeout = useRef(null)
  const [config, setConfig] = useState()
  const [typing, setTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchApplicantType = async () => {
      try {
        const applicantTypeResponse = await getAction(
          '/admin-config/applicant-type/'
        )
        const commissionerResponse = await getAction(
          '/admin-config/commissioner/'
        )
        setConfig({
          applicantType: applicantTypeResponse,
          commissioner: commissionerResponse
        })
      } catch (error) {
        console.error('Error fetching applicant type:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchApplicantType()

    if (!ICLApp?.RegInfo) {
      setICLApp('RegInfo', {
        ...(ICLApp?.RegInfo || {}),
        Valid: true
      })
    }
  }, [])

  const handleCancel = () => {
    router.push('/')
  }

  if (loading) {
    return <TwoColSkeleton />
  }

  const handleNextAction = async () => {
    const validationResult = applicantSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
    } else {
      setErrors({})
      if (ICLApp?.RegInfo?.Valid && ICLApp.ApplicantType === '01') {
        const appData = {
          applicant_type_code: ICLApp.ApplicantType,
          applicant_number: ICLApp.RegInfo.owners[0].id_number
        }
        const createAppResponse = await patchAction(
          `/eservice/draft/${ICLApp.draft_number}/`,
          appData
        )
        const createCompanyResponse = await postAction(
          `/eservice/company/?commercial_record=${ICLApp.RegInfo.commercial_record}&draft_number=${ICLApp.draft_number}`,
          {}
        )
        if (createAppResponse && createCompanyResponse) {
          setCurrentStep(currentStep + 1)
        }
      } else {
        if (ICLApp.OnBehalf === '01') {
          const appData = {
            applicant_type_code: ICLApp.ApplicantType,
            commissioner_code: ICLApp.OnBehalf,
            applicant_number: ICLApp.ApplicantNum,
            beneficiary_number: ICLApp.RegInfo.owners[0].id_number
          }
          patchAction(`/eservice/draft/${ICLApp.draft_number}/`, appData)
          postAction(
            `/eservice/company/?commercial_record=${ICLApp.RegInfo.commercial_record}&draft_number=${ICLApp.draft_number}`,
            {}
          )
          setCurrentStep(currentStep + 1)
        } else {
          const appData = {
            applicant_type_code: ICLApp.ApplicantType,
            commissioner_code: ICLApp.OnBehalf,
            applicant_number: ICLApp.ApplicantNum
          }

          patchAction(`/eservice/draft/${ICLApp.draft_number}/`, appData)
          postAction(
            `/eservice/company/?commercial_record=${ICLApp.RegInfo.commercial_record}&draft_number=${ICLApp.draft_number}`,
            {}
          )
          setCurrentStep(currentStep + 1)
        }
      }
    }
  }

  const handleApplicantTypeChange = e => {
    setICLApp('ApplicantType', e.target.value)
    setICLApp('OnBehalf', '')
    setICLApp('RegInfo', {
      Valid: true
    })
    setErrors({})
  }

  const handleOnBehalfChange = e => {
    setICLApp('OnBehalf', e.target.value)
    setICLApp('RegInfo', {
      Valid: true
    })
    setErrors({})
  }

  const handleCommercialRegisterationNo = e => {
    setTyping(true)
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }

    const newRegInfo = {
      ...ICLApp.RegInfo,
      commercial_record: e.target.value,
      Show: false
    }
    setICLApp('RegInfo', newRegInfo)

    const fetchCommpany = async () => {
      try {
        const response = await getAction(
          `/eservice/company-sync/?commercial_record=${e.target.value}`
        )
        if (response.error) {
          setICLApp('RegInfo', {
            commercial_record: e.target.value,
            Valid: false,
            Show: false
          })
        } else {
          setICLApp('RegInfo', {
            ...response.company,
            owners: response.owners,
            Valid: true,
            Show: true
          })
        }
        setTyping(false)
      } catch (error) {
        setConfig(error)
        console.error('Error fetching applicant type:', error)
      }
    }

    const regInfoValidation = applicantSchema.safeParse({
      ...ICLApp,
      RegInfo: newRegInfo
    })

    if (!regInfoValidation.success) {
      setErrors(regInfoValidation.error.format())
      setICLApp('RegInfo', {
        commercial_record: e.target.value,
        Valid: false,
        Show: false
      })
      setTyping(false)
    } else {
      setErrors({})
      typingTimeout.current = setTimeout(() => {
        fetchCommpany()
      }, 500)
    }
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
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="applicant-type" className="required">
              Applicant Type
            </label>
            <select
              name="applicant-type"
              id="applicant-type"
              className={`select-tag ${errors?.ApplicantType ? 'input-error' : ''}`}
              value={ICLApp?.ApplicantType}
              onChange={handleApplicantTypeChange}
            >
              <option value="">{''}</option>
              {config.applicantType?.map(type => (
                <option key={type.english_name} value={type.code}>
                  {type.english_name}
                </option>
              ))}
            </select>
            {errors.ApplicantType && (
              <p className="error-msg">{errors.ApplicantType._errors[0]}</p>
            )}
          </div>

          {ICLApp?.ApplicantType === '02' && (
            <div
              data-aos="fade-left"
              data-aos-offset="0"
              className="field-container"
              style={{ gridColumn: 2, gridRow: 1 }}
            >
              <label htmlFor="authorized-on-behalf" className="required">
                Authorized on Behalf
              </label>
              <select
                name="authorized-on-behalf"
                id="authorized-on-behalf"
                className={`select-tag ${errors?.OnBehalf ? 'input-error' : ''}`}
                value={ICLApp?.OnBehalf}
                onChange={handleOnBehalfChange}
              >
                <option value="">{''}</option>
                {config.commissioner?.map(type => (
                  <option key={type.english_name} value={type.code}>
                    {type.english_name}
                  </option>
                ))}
              </select>
              {errors.OnBehalf && (
                <p className="error-msg">{errors.OnBehalf._errors[0]}</p>
              )}
            </div>
          )}
          {ICLApp?.ApplicantType === '01' && (
            <>
              <div
                data-aos="fade-right"
                className="field-container"
                style={{ gridColumn: 1, gridRow: 2 }}
              >
                <label htmlFor="applicant-name">Applicant Name</label>
                <input
                  name="applicant-name"
                  id="applicant-name"
                  value="Test Applicant"
                  className="select-tag"
                  disabled
                />
              </div>
              <div
                data-aos="fade-left"
                className="field-container"
                style={{ gridColumn: 2, gridRow: 2 }}
              >
                <label htmlFor="applicant-id">Applicant ID</label>
                <input
                  name="applicant-id"
                  id="applicant-id"
                  value="123456789"
                  className="select-tag"
                  disabled
                />
              </div>
            </>
          )}
          {(ICLApp?.ApplicantType === '01' ||
            (ICLApp?.ApplicantType === '02' && ICLApp?.OnBehalf)) && (
            <>
              <div
                data-aos="fade-right"
                className="field-container"
                style={{ gridColumn: 1, gridRow: 3 }}
              >
                <label htmlFor="commercial-register" className="required">
                  Commercial Registeration No.
                </label>
                <input
                  name="commercial-register"
                  id="commercial-register"
                  className={`select-tag ${errors?.RegInfo || !ICLApp.RegInfo?.Valid ? 'input-error' : ''}`}
                  value={ICLApp?.RegInfo?.commercial_record || ''}
                  onChange={handleCommercialRegisterationNo}
                />
                {errors?.RegInfo && (
                  <p className="error-msg">{errors.RegInfo._errors[0]}</p>
                )}
                {!ICLApp.RegInfo?.Valid && !errors?.RegInfo && (
                  <p className="error-msg">
                    This Registration Number Is Not Valid
                  </p>
                )}
              </div>
              {typing && <LoadingBar gridCol="span 2" gridRow="4" />}
            </>
          )}
          {ICLApp?.RegInfo?.Show && (
            <>
              <div
                data-aos="fade-left"
                data-aos-delay="0"
                className="field-container"
                style={{ gridColumn: 2, gridRow: 3 }}
              >
                <label htmlFor="facility-name">Facility Name</label>
                <input
                  name="facility-name"
                  id="facility-name"
                  value={ICLApp?.RegInfo?.name || ''}
                  className="select-tag"
                  disabled
                />
              </div>
              <div
                data-aos="fade-right"
                data-aos-delay="100"
                className="field-container"
                style={{ gridColumn: 1, gridRow: 4 }}
              >
                <label htmlFor="commercial-registeration-source">
                  Commercial Registeration Source
                </label>
                <input
                  name="commercial-registeration-source"
                  id="commercial-registeration-source"
                  value={ICLApp?.RegInfo?.record_source || ''}
                  className="select-tag"
                  disabled
                />
              </div>
              <div
                data-aos="fade-left"
                data-aos-delay="200"
                className="field-container"
                style={{ gridColumn: 2, gridRow: 4 }}
              >
                <label htmlFor="facility-number">Facility Number</label>
                <input
                  name="facility-number"
                  id="facility-number"
                  value={ICLApp?.RegInfo?.FacName || '123456789'}
                  className="select-tag"
                  disabled
                />
              </div>
            </>
          )}
          {ICLApp?.OnBehalf === '01' && ICLApp?.RegInfo?.Show && (
            <>
              <div
                data-aos="fade-right"
                data-aos-delay="300"
                className="field-container"
                style={{ gridColumn: 1, gridRow: 5 }}
              >
                <label htmlFor="owner-id">Owner ID</label>
                <input
                  name="owner-id"
                  id="owner-id"
                  value={ICLApp?.RegInfo?.owners[0]?.id_number || ''}
                  className="select-tag"
                  disabled
                />
              </div>
              <div
                data-aos="fade-left"
                data-aos-delay="400"
                className="field-container"
                style={{ gridColumn: 2, gridRow: 5 }}
              >
                <label htmlFor="owner-name">Owner Name</label>
                <input
                  name="owner-name"
                  id="owner-name"
                  value={
                    `${ICLApp?.RegInfo?.owners[0].first_name} ${ICLApp?.RegInfo?.owners[0].second_name} ${ICLApp?.RegInfo?.owners[0].third_name} ${ICLApp?.RegInfo?.owners[0].last_name}` ||
                    ''
                  }
                  className="select-tag"
                  disabled
                />
              </div>
            </>
          )}
        </div>
      </form>
      <div className="wizard-buttons">
        <Button variant="secondary" size="lg" onClick={showModal}>
          Cancel
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

export default Applicant
