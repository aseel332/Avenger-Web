import React, { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogedIn, setIsLogedIn] = useState(JSON.parse(localStorage.getItem("login")) || "");

  console.log(currentUser);
  

  async function userSignUp(email, password){
    try{
      await createUserWithEmailAndPassword(auth, email, password);
      await signInWithEmailAndPassword(auth, email, password);

      //setCurrentUser(userCredential.user);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        email: auth.currentUser.email,
        createdAt: serverTimestamp(),
        type: "user"
      })
      console.log("Successfully registered user:", auth.currentUser.uid);
      setIsLogedIn("user");
    } catch(err){
      console.log(err.message);
    } finally{
      console.log("Done");
    }
  }

  function userLogout(){
    setCurrentUser(null);
    setUserData(null);
    localStorage.removeItem("login");
    return signOut(auth);
  }

  async function adminLogin(email, password){
    try { 
      await signInWithEmailAndPassword(auth, email, password);
      const adminRef = doc(db, "admins", auth.currentUser.uid);
      const adminSnap = await getDoc(adminRef);

      if(adminSnap.exists()){
        console.log("exists");
        setIsLogedIn("admin");
        localStorage.setItem("login", JSON.stringify("admin"));
      } else{
        console.log("This is not an admin");
        userLogout(auth);
      }

    } catch(err){
      console.log(err.message);
    } finally{
      console.log("Done");
    }
    
  }

  async function userLogin(email, password){
    try { 
      await signInWithEmailAndPassword(auth, email, password);
      const adminRef = doc(db, "users", auth.currentUser.uid);
      const adminSnap = await getDoc(adminRef);

      if(adminSnap.exists()){
        console.log("exists");
        setIsLogedIn("user");
        localStorage.setItem("login", JSON.stringify("user"));
      } else{
        console.log("This is not an user");
        userLogout(auth);
      }

    } catch(err){
      console.log(err.message);
    } finally{
      console.log("Done");
    }
  }

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      setLoading(true);
      setCurrentUser(user);


    } catch (err) {
      console.error("Auth context error:", err);
    } finally {
      setLoading(false);
    }
  });

  return unsubscribe;
}, []);


  const value = {
    userSignUp, currentUser, userLogout, isLogedIn, setIsLogedIn, adminLogin, userLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
