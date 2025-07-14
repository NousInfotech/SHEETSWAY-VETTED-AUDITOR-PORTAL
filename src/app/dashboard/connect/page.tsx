"use client";
import React from 'react';
import { ConnectView } from '@/features/connect';
import PageContainer from '@/components/layout/page-container';

const ConnectPage = () => {
  return (
    <PageContainer>
      <div className='container mx-auto'>
          <ConnectView />
      </div>
    </PageContainer>
  )
};

export default ConnectPage;

