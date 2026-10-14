import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/sign-up/SignUp'
import SignIn from './pages/sign-in/SignIn'

export default function App() {
  return (
    <Routes>
      <Route path="/registro" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/registro" replace />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
  )
}