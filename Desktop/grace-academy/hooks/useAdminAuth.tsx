"use client";

import * as React from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/firebase/config";

interface AdminAuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = React.createContext<AdminAuthState | null>(null);

/**
 * There is no public sign-up flow anywhere on this site. Admin accounts are
 * created manually in Firebase Console → Authentication → Add user — see
 * README "Admin Portal" section. Being signed in at all is treated as being
 * an admin (see firebase_rules/firestore.rules for the matching rule).
 */
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase isn't configured yet. Check your environment variables.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = React.useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
