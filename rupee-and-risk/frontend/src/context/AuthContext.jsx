import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // Supabase user with is_pro_member
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Listen to Firebase auth state ───────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

          // Fetch PRO status from our Supabase via /me
          const res = await axios.get(`${API}/api/auth/me`);
          setUser(res.data);
        } catch (err) {
          console.error('Failed to fetch user profile from backend:', err);
          // Still set a basic user from Firebase so UI isn't broken
          setUser({ email: fbUser.email, full_name: fbUser.displayName || '', is_pro_member: false });
        }
      } else {
        setFirebaseUser(null);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Re-fetch fresh token before API calls (tokens expire after 1 hour) ──
  const getFreshToken = async () => {
    if (!firebaseUser) return null;
    const idToken = await firebaseUser.getIdToken(true); // force refresh
    setToken(idToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
    return idToken;
  };

  // ── Auth functions ───────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      const msg = firebaseErrorMessage(error.code);
      return { success: false, error: msg };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name in Firebase
      await updateProfile(cred.user, { displayName: fullName });
      return { success: true };
    } catch (error) {
      const msg = firebaseErrorMessage(error.code);
      return { success: false, error: msg };
    }
  };

  const googleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Google Sign-In failed. Please try again.' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const msg = firebaseErrorMessage(error.code);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  // ── Human-readable Firebase error messages ────────────────────────
  const firebaseErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try signing in.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      token,
      loading,
      login,
      register,
      googleLogin,
      forgotPassword,
      logout,
      getFreshToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
