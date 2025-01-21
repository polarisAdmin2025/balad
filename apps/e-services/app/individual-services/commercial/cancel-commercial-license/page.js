'use client'

import Header from '@repo/ui/header'
import Wizard from '@repo/ui/wizard'
import ApplicationInfo from '@repo/ui/applicationInfo'
import Applicant from '@repo/ui/applicantccl'
import CommercialActivity from '@repo/ui/commercialccl'


const steps = [
  {
    step: 1,
    name: 'Submission Information',
    component:<ApplicationInfo />
   
  },
  {
    step: 2,
    name: 'Applicant',
    component:<Applicant />
   
  },
  {
    step: 3,
    name: 'Commercial Activity',
    component:<CommercialActivity />
    
   
  },
  {
    step: 4,
    name: 'Geographical Location',
   
  },
  {
    step: 5,
    name: 'Fees',
   
  }
]

const CancelComLic = () => {
  return (
    <div>
      <Header />
      <Wizard
        steps={steps}
        title="Services / Individual Services / Cancel a License"
      />
    </div>
  )
}

export default CancelComLic