import React from 'react'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income"
import Expence from "./pages/Dashboard/Expence"
import UserProvider from './context/UserContext';
import {Toaster} from 'react-hot-toast'; 

function App() {
  return (
    <UserProvider>
    <div>
    
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Home />} />
          <Route path='/income' element={<Income />} />
          <Route path='/expense' element={<Expence />} />
        </Routes>
      </BrowserRouter>

    </div>

     <Toaster 
       toastOptions={{
        className: '',
         style: {
          fontSize: '13px'
         },
       }}
     />

    </UserProvider>

  )
}

export default App

const Root = () => {
  // Check if token exist in localStronge
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ?(
    <Navigate to="/dashboard"/>
  ) : (
    <Navigate to="/login" />
  );
}