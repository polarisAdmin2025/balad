'use client'

import { useEffect, useState } from 'react'
import { getAction } from './util/actions'

const ApplicationDetails = ({ draftNumber }) => {
  const [applicationData, setApplicationData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await getAction(`/eservice/draft/${draftNumber}/`)
        setApplicationData(response)
      } catch (error) {
        console.error('Error fetching application details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicationDetails()
  }, [draftNumber])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="content-container">
      <h2 className="wizard-title">بيانات الطلب</h2>
      
      <div className="grid grid-col-3 gap-40">
        <div>
          <label>اسم مقدم الطلب</label>
          <div className="select-tag">{applicationData?.applicant_name}</div>
        </div>
        <div>
          <label>رقم هوية مقدم الطلب</label>
          <div className="select-tag">{applicationData?.applicant_number}</div>
        </div>
        <div>
          <label>نوع مقدم الطلب</label>
          <div className="select-tag">{applicationData?.applicant_type}</div>
        </div>

        <div>
          <label>اسم المالك</label>
          <div className="select-tag">{applicationData?.owner_name}</div>
        </div>
        <div>
          <label>رقم هوية المالك</label>
          <div className="select-tag">{applicationData?.owner_id}</div>
        </div>
        <div>
          <label>رقم الوثيقة</label>
          <div className="select-tag">{applicationData?.document_number}</div>
        </div>

        <div>
          <label>رقم الطلب</label>
          <div className="select-tag">{applicationData?.application_number}</div>
        </div>
        <div>
          <label>حالة الطلب</label>
          <div className="select-tag">{applicationData?.status}</div>
        </div>
        <div>
          <label>نوع الطلب</label>
          <div className="select-tag">{applicationData?.application_type}</div>
        </div>
      </div>

      <h2 className="wizard-title mt-8">بيانات الرخصة والسجل التجاري</h2>
      
      <div className="grid grid-col-3 gap-40">
        <div>
          <label>نوع الرخصة</label>
          <div className="select-tag">{applicationData?.license_type}</div>
        </div>
        <div>
          <label>مدة الترخيص</label>
          <div className="select-tag">{applicationData?.license_duration}</div>
        </div>
        <div>
          <label>رقم السجل التجاري</label>
          <div className="select-tag">{applicationData?.commercial_record}</div>
        </div>

        <div>
          <label>مصدر السجل التجاري</label>
          <div className="select-tag">{applicationData?.record_source}</div>
        </div>
        <div>
          <label>رقم المنشأة</label>
          <div className="select-tag">{applicationData?.facility_number}</div>
        </div>
        <div>
          <label>اسم المنشأة</label>
          <div className="select-tag">{applicationData?.facility_name}</div>
        </div>
      </div>

      <div className="tabs mt-8">
        <h3 className="active">بيانات النشاط</h3>
        <h3>بيانات المحل</h3>
        <h3>بيانات اللوحات</h3>
        <h3>المرفقات</h3>
        <h3>الموقع</h3>
        <h3>سير المعاملة</h3>
      </div>

      <div className="grid grid-col-2 gap-40 mt-4">
        <div>
          <label>النشاط التجاري</label>
          <div className="select-tag">{applicationData?.main_activity}</div>
        </div>
        <div>
          <label>النشاط الفرعي</label>
          <div className="select-tag">{applicationData?.sub_activity}</div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationDetails