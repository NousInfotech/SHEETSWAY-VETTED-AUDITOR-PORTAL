// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// 'use client';
// import { useTheme } from 'next-themes';
// import React from 'react';
// import { ActiveThemeProvider } from '../active-theme';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth } from '@/lib/firebase';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
// }

// const AuthContext = React.createContext<AuthContextType>({
//   user: null,
//   loading: true
// });

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = React.useState<User | null>(null);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       (firebaseUser: User | null) => {
//         setUser(firebaseUser);
//         setLoading(false);
//       }
//     );
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return React.useContext(AuthContext);
// }

// export default function Providers({
//   activeThemeValue,
//   children
// }: {
//   activeThemeValue: string;
//   children: React.ReactNode;
// }) {
//   // we need the resolvedTheme value to set the baseTheme for clerk based on the dark or light theme
//   const { resolvedTheme } = useTheme();
//   // resolvedTheme is used for theme detection but not directly used in this component

//   return (
//     <>
//       <ActiveThemeProvider initialTheme={activeThemeValue}>
//         <AuthProvider>{children}</AuthProvider>
//       </ActiveThemeProvider>
//     </>
//   );
// }

// #############################################################################################################

// 'use client';

// import { useTheme } from 'next-themes';
// import React, { useState, useEffect, useContext, createContext } from 'react';
// import { onAuthStateChanged, User } from 'firebase/auth';
// import { auth } from '@/lib/firebase';
// import { ActiveThemeProvider } from '../active-theme';

// // Import your Zustand store and the service function
// import { useProfileStore } from '@/stores/useProfileStore';

// // Define the shape of the context value
// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
// }

// // Create the context
// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true
// });

// // Create the AuthProvider component
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Get the actions from your Zustand store
//   const fetchProfile = useProfileStore((state) => state.fetchProfile);
//   const clearProfile = useProfileStore((state) => state.clearProfile);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       async (firebaseUser: User | null) => {
//         if (firebaseUser) {
//           // USER IS SIGNED IN
//           setUser(firebaseUser);
//           try {
//             // Fetch their backend profile.
//             // The axios interceptor will handle the token and active-role.
//             await fetchProfile();
//           } catch (error) {
//             console.error("Failed to fetch profile after login:", error);
//             // If fetching fails, clear any old data
//             clearProfile();
//           }
//         } else {
//           // USER IS SIGNED OUT
//           setUser(null);
//           // Clear the profile data from the Zustand store
//           clearProfile();
//         }

//         // Mark authentication as complete
//         setLoading(false);
//       }
//     );
//     // Cleanup the listener on component unmount
//     return () => unsubscribe();
//   }, [fetchProfile, clearProfile]); // Correctly list dependencies

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
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

// #################################################################################################

'use client';

import { useTheme } from 'next-themes';
import React, { useState, useEffect, useContext, createContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ActiveThemeProvider } from '../active-theme';

// Import your Zustand store and the service function
import { useProfileStore } from '@/stores/useProfileStore';

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

  // Get the actions from your Zustand store
  // const fetchProfile = useProfileStore((state) => state.fetchProfile);
  // const clearProfile = useProfileStore((state) => state.clearProfile);

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
          // clearProfile();
        }

        // Mark authentication as complete
        setLoading(false);
      }
    );
    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []); // Correctly list dependencies

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
