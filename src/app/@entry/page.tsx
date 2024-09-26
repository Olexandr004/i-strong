'use client'
import { NextPage } from 'next'

import { EntryComponent } from '@/modules/views'
import { FormSubmitProvider } from '@/shared/components'
// import { FormSubmitProvider } from '@/shared/components'

// page
const EntryPage: NextPage = () => {
  // return
  return (
    <FormSubmitProvider>
      <EntryComponent />
    </FormSubmitProvider>
  )
}

export default EntryPage
