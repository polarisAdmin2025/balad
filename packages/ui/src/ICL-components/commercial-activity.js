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
  const { ICLApp, setICLApp, currentStep, setCurrentStep, updateICLApp } =
    useStore()
  const [boardNo, setBoardNo] = useState(1)
  const [errors, setErrors] = useState({})
  const [config, setConfig] = useState()
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (ICLApp?.BoardDetails) {
      setBoardNo(ICLApp['BoardDetails'].length)
    }
  }, [ICLApp])

  const createBoardDetails = async () => {
    const appData = {
      draft_number: ICLApp.draft_number,
      board_type_code: '01'
    }
    const boarddeatails = await postAction('/eservice/board/', appData)

    if (ICLApp.BoardDetails) {
      const BoardDetailsArray = [
        ...ICLApp.BoardDetails,
        {
          BoardArea: '',
          BoardType: '01',
          BoardID: boarddeatails.id
        }
      ]
      await setICLApp('BoardDetails', BoardDetailsArray)
    } else {
      await setICLApp('BoardDetails', [
        {
          BoardArea: '',
          BoardType: '01',
          BoardID: boarddeatails.id
        }
      ])
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      try {
        const mainActivityResponse = await getAction('/admin-config/main-activity')
        const boardTypeResponse = await getAction('/admin-config/board-types')

        if (!signal.aborted) {
          setConfig({
            mainActivity: mainActivityResponse,
            boardType: boardTypeResponse
          })

          if (!ICLApp?.BoardDetails) {
            await createBoardDetails()
          }

          setLoading(false)
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error('Error initializing commercial activity:', error)
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      controller.abort()
    }
  }, []) // Empty dependency array

  const handleCancel = () => {
    router.push('/')
  }

  const handleNextAction = async () => {
    const validationResult = commericalSchema.safeParse(ICLApp)
    if (!validationResult.success) {
      setErrors(validationResult.error.format())
    } else {
      setErrors({})
      const appData = {
        main_activity_code: ICLApp.MainCommerical,
        sub_activity_code: ICLApp.SubActivity,
        additional_activity_code: ICLApp.AdditionalActivity,
        shop: {
      name: "shop",
      number: "123",
      state_number: "123",
      floor_count: 4,
      window_count: 2,
      area: 100
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
            console.warn(appDataBoard)
          })
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousAction = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleMainCommericalChange = async e => {
    setICLApp('MainCommerical', e.target.value)
    if (e.target.value) {
      const main_code = e.target.value
      const subActivityResponse = await getAction(
        `/admin-config/sub-activity/?main_activity_code=${main_code}`
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
      const sub_code = e.target.value
      const additionalResponse = await getAction(
        `/admin-config/additional-activity/?sub_activity_code=${sub_code}`
      )
      setICLApp('additionalResponse', additionalResponse)
    } else {
      setICLApp('additionalResponse', [])
    }
    setICLApp('AdditionalActivity', '')
  }

  const handleBoardTypeChange = (index, e) => {
    updateICLApp('BoardDetails', index, 'BoardType', e.target.value)
  }

  const handleBoardAreaChange = (index, e) => {
    updateICLApp('BoardDetails', index, 'BoardArea', e.target.value)
  }

  const handleAddBoard = async () => {
    await createBoardDetails()
    setBoardNo(prev => prev + 1)
  }

  const handleDeleteBoard = async index => {
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
            <label htmlFor="main-commercial" className="required">
              Main Commercial Activity
            </label>
            <select
              name="main-commercial"
              id="main-commercial"
              className={`select-tag ${errors?.MainCommerical ? 'input-error' : ''}`}
              value={ICLApp?.MainCommerical}
              onChange={handleMainCommericalChange}
            >
              <option value="">{''}</option>
              {config?.mainActivity?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
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
              {ICLApp?.subActivityResponse?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
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
            <label htmlFor="additional-activity" className="required">
              Additional Activity
            </label>
            <select
              name="additional-activity"
              id="additional-activity"
              className={`select-tag ${errors?.AdditionalActivity ? 'input-error' : ''}`}
              value={ICLApp?.AdditionalActivity}
              onChange={e => {
                setICLApp('AdditionalActivity', e.target.value)
              }}
            >
              <option value="">{''}</option>
              {ICLApp?.additionalResponse?.map(item => (
                <option key={item.english_name} value={item.code}>
                  {item.english_name}
                </option>
              ))}
            </select>
            {errors.AdditionalActivity && (
              <p className="error-msg">{errors.AdditionalActivity._errors[0]}</p>
            )}
          </div>
          <div
            data-aos="fade-right"
            data-aos-delay="150"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 2 }}
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
            data-aos-delay="200"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 2 }}
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
            data-aos-delay="250"
            className="field-container"
            style={{ gridColumn: 3, gridRow: 2 }}
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
            data-aos-delay="300"
            className="field-container"
            style={{ gridColumn: 1, gridRow: 3 }}
          >
            <label htmlFor="floors-number" className="required">
              Floors Number
            </label>
            <input
              name="floors-number"
              id="floors-number"
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
            data-aos-delay="350"
            className="field-container"
            style={{ gridColumn: 2, gridRow: 3 }}
          >
            <label htmlFor="entrances-number" className="required">
              Entrances Number
            </label>
            <input
              name="entrances-number"
              id="entrances-number"
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
            data-aos-delay="400"
            className="field-container"
            style={{ gridColumn: 3, gridRow: 3 }}
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
        <div data-aos="fade-right" data-aos-delay="150" className="sub-title">
          <h3>Board Details</h3>
        </div>
        <div className="grid grid-col-3 grid-self-end">
          {ICLApp?.BoardDetails?.map((board, index) => (
            <>
              <div
                key={`type-${index}`}
                data-aos="fade-right"
                data-aos-delay="0"
                className="field-container"
                style={{ gridColumn: 1, gridRow: index + 1 }}
              >
                <label htmlFor={`board-type-${index}`} className="required">
                  Board Type
                </label>
                <select
                  name={`board-type-${index}`}
                  id={`board-type-${index}`}
                  className={`select-tag ${errors?.BoardDetails?.[index]?.BoardType ? 'input-error' : ''}`}
                  value={board.BoardType}
                  onChange={e => handleBoardTypeChange(index, e)}
                >
                  <option value="">{''}</option>
                  {config?.boardType?.map(item => (
                    <option key={item.english_name} value={item.code}>
                      {item.english_name}
                    </option>
                  ))}
                </select>
                {errors?.BoardDetails?.[index]?.BoardType && (
                  <p className="error-msg">
                    {errors.BoardDetails[index].BoardType._errors[0]}
                  </p>
                )}
              </div>
              <div
                key={`area-${index}`}
                data-aos="fade-right"
                data-aos-delay="50"
                className="field-container"
                style={{ gridColumn: 2, gridRow: index + 1 }}
              >
                <label htmlFor={`board-area-${index}`} className="required">
                  Board Area
                </label>
                <input
                  name={`board-area-${index}`}
                  id={`board-area-${index}`}
                  className={`select-tag ${errors?.BoardDetails?.[index]?.BoardArea ? 'input-error' : ''}`}
                  value={board.BoardArea}
                  onChange={e => handleBoardAreaChange(index, e)}
                />
                {errors?.BoardDetails?.[index]?.BoardArea && (
                  <p className="error-msg">
                    {errors.BoardDetails[index].BoardArea._errors[0]}
                  </p>
                )}
              </div>
              <div
                key={`delete-${index}`}
                data-aos="fade-right"
                data-aos-delay="100"
                className="field-container"
                style={{ gridColumn: 3, gridRow: index + 1 }}
              >
               {index === 0 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleAddBoard}
                  >
                    Add Board
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => handleDeleteBoard(index)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </>
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

