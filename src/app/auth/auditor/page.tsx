import { AuditorRegistrationForm } from '@/components/auth-register/AuditorRegistrationForm';
import PageContainer from '@/components/layout/page-container';

import React from 'react';

const page = () => {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <AuditorRegistrationForm />
      </div>
    </PageContainer>
  );
};

export default page;
