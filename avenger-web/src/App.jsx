import { useEffect, useState } from 'react'

import './App.css'
import { getFirstThreeHeadlines } from '../utils/headlines'
import PreLayout from '../components/PreLayout'
import PostLayoutAdmin from '../components/PostLayoutAdmin';
import { useAuth } from './context/AuthContext';
import PostLayoutUser from './PostLayoutUser';
import { auth } from '../firebase';

function App() {

  const  { isLogedIn, setIsLogedIn } = useAuth();
  

  
  
  return (
   <>

    { isLogedIn? <PostLayoutAdmin type = {isLogedIn}/> : <PreLayout isLogedIn={isLogedIn} setIsLogedIn={setIsLogedIn} />}
  
   </>
  )
}

export default App
