'use client'

import { useState, useEffect } from 'react'
import useStore, { useModal } from '../shared-store/store'
import Image from 'next/image'
import { commericalSchema } from '../util/zod'
import ThreeColSkeleton from '../skeletons/three-col-skeleton'
import {
  getAction,
  patchAction,
  postAction,
  deleteAction
} from '../util/actions'
import { Button } from '../button'
import Modal from '../modal/modal'
import { useRouter } from 'next/navigation'

const CommercialActivity = () => {
  const { isOpen, showModal, closeModal } = useModal()
  const { ICLApp, setICLApp, currentStep, setCurrentStep, updateICLApp } = useStore()
  const [boardNo, setBoardNo] = useState(0)
  const [errors, setErrors] = useState({})
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Single useEffect for initialization and data fetching
  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      try {
        // Fetch config data
        const [mainActivityResponse, boardTypeResponse] = await Promise.all([
          getAction('/admin-config/main-activity'),
          getAction('/admin-config/board-types')
        ])

        if (!mounted) return

        setConfig({
          mainActivity: mainActivityResponse,
          boardType: boardTypeResponse
        })

        // Create initial board only if needed
        if (ICLApp?.draft_number && !ICLApp?.BoardDetails) {
          const appData = {
            draft_number: ICLApp.draft_number,
            board_type_code: '01'
          }
          const boardDetails = await postAction('/eservice/board/', appData)
          
          if (!mounted) return

          setICLApp('BoardDetails', [{
            BoardArea: '',
            BoardType: '01',
            BoardID: boardDetails.id
          }])
          setBoardNo(1)
        }
      } catch (error) {
        console.error('Error initializing:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [ICLApp?.draft_number, setICLApp])

  // Update board count when BoardDetails changes
  useEffect(() => {
    if (ICLApp?.BoardDetails) {
      setBoardNo(ICLApp.BoardDetails.length)
    }
  }, [ICLApp?.BoardDetails])

  const handleNextAction = () => {
    const validationResult = commericalSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
    } else {
      for (let i = 0; i < ICLApp.BoardDetails.length; i++) {
        if (ICLApp.BoardDetails[i].BoardType === '01') {
          setErrors({})
          const appData = {
            main_activity_code: ICLApp.MainCommerical,
            sub_activity_code: ICLApp.SubActivity,
            additional_activity_code: ICLApp.AdditionalActivity,
            shop: {
              name: ICLApp.StoreName,
              number: ICLApp.StoreNum,
              state_number: ICLApp.PropertyNum,
              floor_count: ICLApp.FloorsNum,
              window_count: ICLApp.EntrancesNum,
              area: ICLApp.StoreArea
            }
          }
          patchAction(`/eservice/draft/${ICLApp.draft_number}/`, appData)

          ICLApp.BoardDetails.forEach(element => {
            const appDataBoard = {
              board_type_code: element.BoardType,
              area: element.BoardArea,
              draft_number: ICLApp.draft_number
            }
            patchAction(
              `/eservice/board-modify/${element.BoardID}/`,
              appDataBoard
            )
          })

          setCurrentStep(currentStep + 1)
          break
        } else if (ICLApp.BoardDetails.length === i + 1) {
          setErrors({
            BoardError: 'Please Add At Least One BillBoard'
          })
        }
      }
    }
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const AddBoard = async () => {
    const appData = {
      draft_number: ICLApp.draft_number,
      board_type_code: '01'
    }
    const boardDetails = await postAction('/eservice/board/', appData)

    if (ICLApp.BoardDetails) {
      const BoardDetailsArray = [
        ...ICLApp.BoardDetails,
        {
          BoardArea: '',
          BoardType: '01',
          BoardID: boardDetails.id
        }
      ]
      setICLApp('BoardDetails', BoardDetailsArray)
    }
  }

  const handleBillboardTypeChange = (e, index) => {
    updateICLApp('BoardDetails', index, 'BoardType', e.target.value)
  }

  const handleBillboardAreaChange = (e, index) => {
    updateICLApp('BoardDetails', index, 'BoardArea', e.target.value)
  }

  const handleMainCommericalChange = async e => {
    setICLApp('MainCommerical', e.target.value)
    if (e.target.value) {
      const main_code = config.mainActivity.find(
        item => item.code === e.target.value
      )
      const subActivityResponse = await getAction(
        `/admin-config/sub-activity/?main_activity_id= ${main_code}`
      )
      setICLApp('subActivityResponse', subActivityResponse)
    } else {
      setICLApp('subActivityResponse', [])
      setICLApp('additionalResponse', [])
    }
    setICLApp('SubActivity', '')
    setICLApp('AdditionalActivity', '')
  }

  const handleSubActivityChange = async e => {
    setICLApp('SubActivity', e.target.value)
    if (e.target.value) {
      const sub_code = ICLApp.subActivityResponse.find(
        item => item.code === e.target.value
      )
      const additionalResponse = await getAction(
        `/admin-config/additional-activity/?sub_activity_id= ${sub_code}`
      )
      setICLApp('additionalResponse', additionalResponse)
    } else {
      setICLApp('additionalResponse', [])
    }
    setICLApp('AdditionalActivity', '')
  }

  const handleCancel = () => {
    router.push('/')
  }

  const handleAdditionalActivity = e => {
    setICLApp('AdditionalActivity', e.target.value)
  }

  const deleteBoard = async index => {
    const newBoardArray = []
    const boardID = ICLApp.BoardDetails[index].BoardID
    for (let i = 0; i < ICLApp.BoardDetails.length; i++) {
      if (ICLApp.BoardDetails[i].BoardID !== boardID) {
        newBoardArray.push(ICLApp.BoardDetails[i])
      }
    }
    setICLApp('BoardDetails', newBoardArray)
    await deleteAction(`/eservice/board-modify/${boardID}/`)
  }

  if (loading) {
    return <ThreeColSkeleton />
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
        <div className="grid grid-col-3">
          <div
            data-aos="fade-right"
            data-aos-delay="0"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="commercial-activity" className="required">
              Commercial Activity
            </label>
            <select
              name="commercial-activity"
              id="commercial-activity"
              className={`select-tag ${errors?.MainCommerical ? 'input-error' : ''}`}
              value={ICLApp?.MainCommerical}
              onChange={handleMainCommericalChange}
            >
              <option value="">{''}</option>
              {config?.mainActivity?.map(type => (
                <option key={type.english_name} value={type.code}>
                  {type.english_name}
                </option>
              ))}
            </select>
            {errors.MainCommerical && (
              <p className="error-msg">{errors.MainCommerical._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="50"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            <label htmlFor="sub-activity" className="required">
              Sub Activity
            </label>
            <select
              name="sub-activity"
              id="sub-activity"
              className={`select-tag ${errors?.SubActivity ? 'input-error' : ''}`}
              value={ICLApp?.SubActivity}
              onChange={handleSubActivityChange}
            >
              <option value="">{''}</option>
              {ICLApp.subActivityResponse?.map(type => (
                <option key={type.english_name} value={type.code}>
                  {type.english_name}
                </option>
              ))}
            </select>
            {errors.SubActivity && (
              <p className="error-msg">{errors.SubActivity._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="100"
            className="field-container"
            style={{ gridColumn: 3, gridRow: 1 }}
          >
            <label htmlFor="additional-activities" className="required">
              Additional Activities
            </label>
            <select
              name="additional-activities"
              id="additional-activities"
              className={`select-tag ${errors?.AdditionalActivity ? 'input-error' : ''}`}
              value={ICLApp?.AdditionalActivity}
              onChange={handleAdditionalActivity}
            >
              <option value="">{''}</option>
              {ICLApp.additionalResponse?.map(type => (
                <option key={type.english_name} value={type.code}>
                  {type.english_name}
                </option>
              ))}
            </select>
            {errors.AdditionalActivity && (
              <p className="error-msg">
                {errors.AdditionalActivity._errors[0]}
              </p>
            )}
          </div>
        </div>
        <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
          <h3>Store details</h3>
        </div>
        <div className="grid grid-col-3">
          <div
            data-aos="fade-right"
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 1 }}
          >
            <label htmlFor="store-name" className="required">
              Store Name
            </label>
            <input
              name="store-name"
              id="store-name"
              className={`select-tag ${errors?.StoreName ? 'input-error' : ''}`}
              value={ICLApp?.StoreName || ''}
              onChange={e => {
                setICLApp('StoreName', e.target.value)
              }}
            />
            {errors.StoreName && (
              <p className="error-msg">{errors.StoreName._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="250"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 1 }}
          >
            <label htmlFor="store-number" className="required">
              Store Number
            </label>
            <input
              name="store-number"
              id="store-number"
              className={`select-tag ${errors?.StoreNum ? 'input-error' : ''}`}
              value={ICLApp?.StoreNum || ''}
              onChange={e => {
                setICLApp('StoreNum', e.target.value)
              }}
            />
            {errors.StoreNum && (
              <p className="error-msg">{errors.StoreNum._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="300"
            className="field-container"
            style={{ gridColumn: 3, gridRow: 1 }}
          >
            <label htmlFor="property-number" className="required">
              Property Number
            </label>
            <input
              name="property-number"
              id="property-number"
              className={`select-tag ${errors?.PropertyNum ? 'input-error' : ''}`}
              value={ICLApp?.PropertyNum || ''}
              onChange={e => {
                setICLApp('PropertyNum', e.target.value)
              }}
            />
            {errors.PropertyNum && (
              <p className="error-msg">{errors.PropertyNum._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="350"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
          >
            <label htmlFor="number-of-floors" className="required">
              Number of Floors
            </label>
            <input
              name="number-of-floors"
              id="number-of-floors"
              className={`select-tag ${errors?.FloorsNum ? 'input-error' : ''}`}
              value={ICLApp?.FloorsNum || ''}
              onChange={e => {
                setICLApp('FloorsNum', e.target.value)
              }}
            />
            {errors.FloorsNum && (
              <p className="error-msg">{errors.FloorsNum._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="400"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 2 }}
          >
            <label htmlFor="number-of-Entrances" className="required">
              Number of Entrances
            </label>
            <input
              name="number-of-Entrances"
              id="number-of-Entrances"
              className={`select-tag ${errors?.EntrancesNum ? 'input-error' : ''}`}
              value={ICLApp?.EntrancesNum || ''}
              onChange={e => {
                setICLApp('EntrancesNum', e.target.value)
              }}
            />
            {errors.EntrancesNum && (
              <p className="error-msg">{errors.EntrancesNum._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="450"
            className="field-container"
            style={{ gridColumn: 3, gridRow: 2 }}
          >
            <label htmlFor="store-area" className="required">
              Store Area
            </label>
            <input
              name="store-area"
              id="store-area"
              className={`select-tag ${errors?.StoreArea ? 'input-error' : ''}`}
              value={ICLApp?.StoreArea || ''}
              onChange={e => {
                setICLApp('StoreArea', e.target.value)
              }}
            />
            {errors.StoreArea && (
              <p className="error-msg">{errors.StoreArea._errors[0]}</p>
            )}
          </div>
        </div>
        <div data-aos="fade-right" data-aos-delay="500" className="sub-title">
          <h3>Billboard details</h3>
        </div>
        {errors?.BoardError && (
          <p className="error-msg error-bg">{errors.BoardError}</p>
        )}
        <div className="grid grid-col-4">
          {Array.from({ length: boardNo }, (_, index) => (
            <div
              key={index}
              className="grid grid-col-4"
              data-aos-delay="550"
              style={{ gridColumn: 'span 4', gridRow: index + 1 }}
            >
              <div
                data-aos="fade-right"
                data-aos-delay={boardNo === 1 ? '550' : '0'}
                className="field-container"
                style={{ gridColumn: 'span 2', gridRow: 1 }}
              >
                <label htmlFor="billboard-area-in-meters">
                  Billboard Area in Meters
                </label>
                <input
                  name="billboard-area-in-meters"
                  id="billboard-area-in-meters"
                  className={`select-tag ${errors?.BoardDetails?.[index]?.BoardArea ? 'input-error' : ''}`}
                  value={ICLApp?.BoardDetails[index]?.BoardArea || ''}
                  onChange={e => handleBillboardAreaChange(e, index)}
                />
                {errors.BoardDetails?.[index]?.BoardArea && (
                  <p className="error-msg">
                    {errors.BoardDetails[index].BoardArea._errors[0]}
                  </p>
                )}
              </div>
              <div
                data-aos="fade-right"
                data-aos-delay={boardNo === 1 ? '600' : '100'}
                className="field-container"
                style={{ gridColumn: 'span 2', gridRow: 1 }}
              >
                <label htmlFor="billboard-type" className="required">
                  Billboard Type
                </label>
                <select
                  name="billboard-type"
                  id="billboard-type"
                  className={`select-tag ${errors?.BoardDetails?.[index]?.BoardType ? 'input-error' : ''}`}
                  value={ICLApp?.BoardDetails[index]?.BoardType}
                  onChange={e => handleBillboardTypeChange(e, index)}
                >
                  <option value="">{''}</option>
                  {config?.boardType?.map(type => (
                    <option key={type.english_name} value={type.code}>
                      {type.english_name}
                    </option>
                  ))}
                </select>
                {errors.BoardDetails?.[index]?.BoardType && (
                  <p className="error-msg">
                    {errors.BoardDetails[index].BoardType._errors[0]}
                  </p>
                )}
              </div>
              <div
                data-aos="fade-right"
                data-aos-delay="150"
                className="button-container field-container"
                style={{ gridColumn: 5, gridRow: 1 }}
              >
                {index === 0 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={AddBoard}
                  >
                    Add Board
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => deleteBoard(index)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
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

export default CommercialActivity