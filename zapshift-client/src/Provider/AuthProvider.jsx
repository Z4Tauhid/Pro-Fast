import React, { createContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  getAuth, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  updateProfile 
} from "firebase/auth";
import Swal from 'sweetalert2';
import app from '../Firebase/Firebase.config';

const googleProvider = new GoogleAuthProvider();
export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timer reference for auto logout
  const [logoutTimer, setLogoutTimer] = useState(null);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const logOut = () => {
    setLoading(true);
    clearTimeout(logoutTimer); // clear previous timer
    return signOut(auth);
  };

  // ✅ Function to start auto logout timer
  const startAutoLogoutTimer = () => {
    clearTimeout(logoutTimer); // clear any existing timer
    const timer = setTimeout(() => {
      logOut().then(() => {
        Swal.fire({
          icon: 'warning',
          title: 'Session Timeout',
          text: 'You have been automatically logged out after 30 minutes of inactivity.',
          confirmButtonColor: '#84cc16',
        });
      });
    }, 30 * 60 * 1000); // 30 minutes
    setLogoutTimer(timer);
  };

  // ✅ Reset timer on user activity
  const resetTimerOnActivity = () => {
    window.addEventListener('mousemove', startAutoLogoutTimer);
    window.addEventListener('keydown', startAutoLogoutTimer);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        startAutoLogoutTimer(); // start timer when user logs in
        resetTimerOnActivity(); // reset on activity
      } else {
        clearTimeout(logoutTimer); // clear timer on logout
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(logoutTimer);
      window.removeEventListener('mousemove', startAutoLogoutTimer);
      window.removeEventListener('keydown', startAutoLogoutTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authData = {
    createUser,
    signIn,
    googleSignIn,
    updateUserProfile,
    user,
    loading,
    logOut,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
