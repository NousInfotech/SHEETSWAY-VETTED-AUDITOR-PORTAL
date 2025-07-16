import { AuditFirmRegistrationForm } from '@/components/auth-register/AuditFirmRegistrationForm';
import PageContainer from '@/components/layout/page-container';
import React from 'react';

const page = () => {
  return (
    <PageContainer>
      <div className='container mx-auto'>
        <AuditFirmRegistrationForm />
      </div>
    </PageContainer>
  );
};

export default page;
