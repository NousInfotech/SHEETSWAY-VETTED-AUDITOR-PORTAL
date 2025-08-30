import React from 'react'; // Removed useEffect

import BankingDashboardPage from '@/app/dashboard/banking&accounts/page';

function BankingDataView({engagement}:any) {
  return (
    <>
      <div className='mt-4 border-t p-4'>
        <BankingDashboardPage engagement={engagement}/>
      </div>
    </>
  );
}

export default BankingDataView;
