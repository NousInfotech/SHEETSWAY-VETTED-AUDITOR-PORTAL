'use client';

import { useEffect, useState } from 'react';

// Import all necessary components
import ConnectButton from '@/features/engagements/components/ConnectButton';

// Import the custom hook to access the shared connection state

import { useAuth } from '@/components/layout/providers';
import { fetchConnections } from '@/api/salt-edge';

import { AccountDataModal } from './AccountDataModal';
import ConnectionCard from './ConnectionCard';
import { getClientUser } from '@/api/clientUser';

const Loader = () => (
  <div className='flex h-[50vh] items-center justify-center p-10'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-dashed border-amber-500'></div>
  </div>
);

export default function BankData({ engagement }: any) {
  const { user, loading: authLoading } = useAuth();

  const [clientUser, setclientUser] = useState<any>(null);
  const [connections, setConnections] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any | null>(
    null
  );

  const fetchClientUser = async (clientId: string) => {
    setLoading(true);
    try {
      const client = await getClientUser(clientId);
      console.log('client-user', client);
      setclientUser(client);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (engagement?.request?.id) {
      fetchClientUser(engagement?.request?.userId);
    }
  }, [engagement]);

  const listConnections = async (customerId: string) => {
    setLoading(true);
    try {
      const connections = await fetchConnections(customerId);
      console.log('connections', connections);
      setConnections(connections);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && clientUser?.bankCustomerId) {
      listConnections(clientUser?.bankCustomerId);
    }
  }, [authLoading, clientUser?.bankCustomerId]);

  const handleConnectionSelect = (currentAccount: any) => {
    setSelectedConnection(currentAccount);
  };

  const handleCloseModal = () => {
    setSelectedConnection(null);
  };

  if (loading) {
    <Loader />;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-2xl font-bold'>Financial Dashboard</h1>

      <div className='mb-6 rounded-lg border p-6 text-center'>
        <ConnectButton />
      </div>

      {connections.length > 0 && (
        <>
          <div className='container mx-auto grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
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
