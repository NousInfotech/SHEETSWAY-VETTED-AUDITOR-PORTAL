'use client';

import { useEffect, useState } from 'react';

// Import all necessary components
import ConnectButton from '@/features/engagements/components/ConnectButton';

// Import the custom hook to access the shared connection state

import { useAuth } from '@/components/layout/providers';
import { fetchConnections } from '@/api/salt-edge';
import AccountCardsDisplay from './AccountCardsDisplay';
import { AccountDataModal } from './AccountDataModal';
import ConnectionCard from './ConnectionCard';

export default function BankData() {
  const { user, loading: authLoading } = useAuth();

  const clientUser:any = {};

  // 1. SHARED STATE: Get the connectionId and loading status from the global context.
  // const { connectionId, isLoading } = useConnection();

  // While the context is doing its initial check, show a loading message.
  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto p-4 text-center">
  //       <p>Loading Connection Status...</p>
  //     </div>
  //   );
  // }

  const [connections, setConnections] = useState<any>([]);
  const [selectedConnection, setSelectedConnection] = useState<any | null>(
    null
  );

  const handleConnectionSelect = (currentAccount: any) => {
    setSelectedConnection(currentAccount);
  };

  const handleCloseModal = () => {
    setSelectedConnection(null);
  };

  const listConnections = async (customerId: string) => {
    try {
      const connections = await fetchConnections(customerId);
      console.log('connections', connections);
      setConnections(connections);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authLoading && clientUser?.bankCustomerId) {
      listConnections(clientUser?.bankCustomerId);
    }
  }, [authLoading, clientUser?.bankCustomerId]);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-2xl font-bold'>Financial Dashboard</h1>

      <div className='mb-6 rounded-lg border p-6 text-center'>
        <ConnectButton />
      </div>

      {connections.length > 0 && (
        <>
          <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
            {connections.map((connection: any) => (
              <ConnectionCard
                key={connection?.id}
                connection={connection}
                onSelect={handleConnectionSelect}
              />
            ))}
          </div>
        </>
      )}

      {selectedConnection && (
        <AccountDataModal
          connectionId={selectedConnection?.id}
          isOpen={!!selectedConnection}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
