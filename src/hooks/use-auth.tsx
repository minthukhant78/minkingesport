
"use client";

import React from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { getOrCreateUserProfile } from '@/lib/data';
import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';

export const AuthContext = React.createContext<{ 
    user: User | null; 
    userProfile: UserProfile | null; 
    loading: boolean, 
    refreshUser: () => Promise<void> 
}>({
  user: null,
  userProfile: null,
  loading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const profileUnsubscribeRef = React.useRef<Unsubscribe | null>(null);

  const refreshUser = async () => {
    await auth.currentUser?.reload();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const profile = await getOrCreateUserProfile(currentUser);
      setUserProfile(profile);
    }
  };

  React.useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clean up previous profile listener
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
        profileUnsubscribeRef.current = null;
      }

      setUser(user);
      if (user) {
        setLoading(true);
        // Ensure profile exists before listening. This is a one-time check/create.
        await getOrCreateUserProfile(user); 
        
        // Set up real-time listener for the user profile
        const userRef = doc(db, 'users', user.uid);
        profileUnsubscribeRef.current = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserProfile(doc.data() as UserProfile);
          } else {
            // This case might happen if the doc is deleted from the console.
            // We can try to re-create it here.
            getOrCreateUserProfile(user).then(profile => setUserProfile(profile));
          }
          setLoading(false);
        });
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribeRef.current) {
        profileUnsubscribeRef.current();
      }
    };
  }, []);

  const value = { user, userProfile, loading, refreshUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
