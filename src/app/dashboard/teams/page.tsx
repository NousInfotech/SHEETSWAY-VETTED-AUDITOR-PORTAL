import PageContainer from '@/components/layout/page-container'
import TeamsPage from '@/components/sidebar-items/TeamsPage'
import React from 'react'

function page() {
  return (
    <PageContainer>
        <div className='container mx-auto'>
            <TeamsPage />
        </div>
    </PageContainer>
  )
}

export default page