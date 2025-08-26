'use client';

import { useTheme } from 'next-themes';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ActiveThemeProvider } from '../active-theme';

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});

// Create the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        if (firebaseUser) {
          // USER IS SIGNED IN
          setUser(firebaseUser);
        } else {
          // USER IS SIGNED OUT
          setUser(null);
          // Clear the profile data from the Zustand store
        }

        // Mark authentication as complete
        setLoading(false);
      }
    );
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create the custom hook for easy access
export function useAuth() {
  return useContext(AuthContext);
}

// Create the main Providers component that wraps everything
export default function Providers({
  activeThemeValue,
  children
}: {
  activeThemeValue: string;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <>
      <ActiveThemeProvider initialTheme={activeThemeValue}>
        <AuthProvider>{children}</AuthProvider>
      </ActiveThemeProvider>
    </>
  );
}

// ################################################################################################################






// 'use client';

// import { useTheme } from 'next-themes';
// import React, { useState, useEffect, useContext, createContext } from 'react';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
// import { ActiveThemeProvider } from '../active-theme';
// import { getProfileOnSignIn } from '@/lib/services/userService';

// // Define the shape of the context value
// interface AuthContextType {
//   user: User | null; // The raw Firebase user object
//   appUser: any; // Your custom application user profile
//   loading: boolean;
// }

// // Create the context with proper initial values
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   appUser: null,
//   loading: true
// });

// // Create the AuthProvider component
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [appUser, setAppUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       async (firebaseUser: User | null) => {
//         try {
//           if (firebaseUser) {
//             // USER IS SIGNED IN
//             // 1. Await the token promise correctly
//             const token = await firebaseUser.getIdToken();
//             const profile = await getProfileOnSignIn(token, 'AUDITOR');

//             setUser(firebaseUser);
//             setAppUser(profile);
//           } else {
//             // USER IS SIGNED OUT
//             // 2. Clear both user and appUser state
//             setUser(null);
//             setAppUser(null);
//           }
//         } catch (error) {
//           // 3. Handle potential errors during profile fetch
//           console.error('Failed to fetch user profile:', error);
//           // Still log the user in with Firebase, but without a profile
//           setUser(firebaseUser);
//           setAppUser(null);
//         } finally {
//           // Mark authentication as complete
//           setLoading(false);
//         }
//       }
//     );
//     // Cleanup the listener on component unmount
//     return () => unsubscribe();
//   }, []);

//   return (
//     // 4. Provide all values to the context
//     <AuthContext.Provider value={{ user, appUser, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Create the custom hook for easy access
// export function useAuth() {
//   return useContext(AuthContext);
// }

// // Create the main Providers component that wraps everything
// export default function Providers({
//   activeThemeValue,
//   children
// }: {
//   activeThemeValue: string;
//   children: React.ReactNode;
// }) {
//   const { resolvedTheme } = useTheme();

//   return (
//     <>
//       <ActiveThemeProvider initialTheme={activeThemeValue}>
//         <AuthProvider>{children}</AuthProvider>
//       </ActiveThemeProvider>
//     </>
//   );
// }
