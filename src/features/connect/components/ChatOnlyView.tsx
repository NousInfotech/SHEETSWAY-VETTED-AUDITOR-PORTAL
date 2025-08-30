// 'use client';
// import React, { useEffect, useState } from 'react';
// import { getAuditorById } from '@/api/auditor.api';
// import { ChatThread } from '@/features/chat/components/ChatThread';

// export default function ChatOnlyView({ engagement }: any) {
//   const [auditor, setAuditor] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     if (engagement?.proposal?.auditorId) {
//       const findAuditor = async () => {
//         try {
//           const currentAuditor = await getAuditorById(
//             engagement.proposal.auditorId
//           );
//           setAuditor(currentAuditor);
//         } catch (error) {
//           console.error('Failed to fetch auditor:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       findAuditor();
//     } else {
//       setIsLoading(false);
//       console.warn(
//         'Engagement is missing an auditorId. Chat cannot be loaded.'
//       );
//     }
//   }, [engagement]);

//   // --- Show a loading state until all data is ready ---
//   if (isLoading || !engagement || !auditor) {
//     return <p>Loading Chat...</p>; // Or a spinner component
//   }

//   // --- CORRECTED LOGIC ---
//   // 1. Assign threadId directly from engagement.id
//   const threadId = engagement.id;

//   // 2. The currentUser is the full auditor object we fetched
//   const currentUser = auditor;

//   return (
//     <main>
//       <ChatThread threadId={threadId} currentUser={currentUser} />
//     </main>
//   );
// }

// ###################################################################################################################

'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/layout/providers';
import { ChatThread } from '@/features/chat/components/ChatThread';
import { User } from '@/features/chat/lib/types';
import { getClientUser } from '@/api/clientUser';

// This component now has a single, clear responsibility:
// display the chat for the currently logged-in client user.
export default function ChatOnlyView({ engagement }: any) {
  
  const [clientUser, setclientUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);

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


  // 1. Get the authenticated client user from the auth context.
  const { user, loading: authLoading } = useAuth();

  const my_profile = useMemo(() => {
    // Make it safer by checking if the item exists
    const profileString = localStorage.getItem('userProfile');
    if (!profileString) return null;

    try {
      return JSON.parse(profileString);
    } catch (error) {
      console.error('Failed to parse userProfile from localStorage', error);
      return null;
    }
  }, []); // 3. Use an empty dependency array to run this ONLY ONCE

  // Show a loading state while the user session is being verified.
  if (authLoading) {
    return (
      <p className='text-muted-foreground p-4 text-center'>
        Authenticating User...
      </p>
    );
  }

  // --- 2. VALIDATE ALL NECESSARY DATA ---
  // We need a logged-in user (the client) and a valid chat thread ID from the engagement.
  if (my_profile && engagement?.chatThread?.id) {
    // --- 3. THE CURRENT USER IS THE CLIENT USER ---
    // Normalize the user object from the auth hook to match the chat's expected `User` type.
    const currentUser: User = {
      id: my_profile.id, // Or appUser.uid, depending on your auth object
      name: my_profile.name // Or appUser.displayName
    };

    const receiver = {
      name: clientUser?.name || 'Client'
    };

    return (
      <main>
        <ChatThread
          // The thread ID comes from the nested engagement data
          threadId={engagement.chatThread.id}
          // The current user is the logged-in client
          currentUser={currentUser}
          receiverName={receiver.name}
        />
      </main>
    );
  }

  // --- 4. RENDER A FALLBACK UI ---
  // This will show if the user isn't logged in or if the engagement prop is malformed.
  return (
    <div className='text-muted-foreground p-4 text-center'>
      <h2>Chat Unavailable</h2>
      <p>Could not load the required user or engagement data.</p>
    </div>
  );
}
