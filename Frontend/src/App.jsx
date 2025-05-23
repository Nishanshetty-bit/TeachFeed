import React from 'react'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login.jsx'
import Admin from './Pages/admin/Admin.jsx'
import SelectPage from './Pages/student/SelectPage.jsx'
import TeacherListPage from './Pages/student/TeachersListPage.jsx'
import FeedbackPage from './Pages/student/FeedbackPage.jsx'
import ThankYouPage from './Pages/student/Thankyou.jsx'
import Staff from './Pages/staff/Staff.jsx'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="admin" element={<Admin />} />
      <Route path="select" element={<SelectPage />} />
       <Route path="feedback/:teacherId" element={<FeedbackPage />} />
      <Route path="teachers" element={<TeacherListPage />} />
      <Route path="thankyou" element={<ThankYouPage />} />
      <Route path='staff' element={<Staff/>} />
      

    </Routes>
    </BrowserRouter>
  )
}

export default App