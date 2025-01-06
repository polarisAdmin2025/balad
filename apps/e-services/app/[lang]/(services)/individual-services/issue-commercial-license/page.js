'use server'

import Wizard from '@repo/ui/wizard'
import ApplicationInfo from '@repo/ui/applicationInfo'
import Applicant from '@repo/ui/applicant'
import CommercialActivity from '@repo/ui/commercial-activity'
import GeoLocation from '@repo/ui/geoLocation'
import Attachments from '@repo/ui/attachments'
import Fees from '@repo/ui/fees'

const steps = [
  {
    step: 1,
    name: 'Submission Information',
    component: <ApplicationInfo />
  },
  {
    step: 2,
    name: 'Applicant',
    component: <Applicant />
  },
  {
    step: 3,
    name: 'Commercial Activity',
    component: <CommercialActivity />
  },
  {
    step: 4,
    name: 'Geographical Location',
    component: <GeoLocation />
  },
  {
    step: 5,
    name: 'Attachments',
    component: <Attachments />
  },
  {
    step: 6,
    name: 'Fees',
    component: <Fees />
  }
]

const IssueComLic = () => {
  return (
    <Wizard
      steps={steps}
      title="Services / Individual Services / Issuing a License"
    />
  )
}

export default IssueComLic
