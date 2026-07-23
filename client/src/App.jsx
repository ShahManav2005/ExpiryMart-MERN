import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/buyer/dashboard" element={
        <ProtectedRoute allowedRoles={['buyer']}><h1>Buyer Dashboard</h1></ProtectedRoute>
      } />
      <Route path="/seller/dashboard" element={
        <ProtectedRoute allowedRoles={['seller']}><h1>Seller Dashboard</h1></ProtectedRoute>
      } />
      <Route path="/agent/dashboard" element={
        <ProtectedRoute allowedRoles={['agent']}><h1>Agent Dashboard</h1></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;