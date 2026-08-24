import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import SellerDashboard from './pages/seller/SellerDashboard'
import AgentDashboard from './pages/agent/AgentDashboard'
import ProductListing from './pages/buyer/ProductListing' 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/buyer/dashboard" element={
        <ProtectedRoute allowedRoles={['buyer']}> <ProductListing /> </ProtectedRoute>
      } />
      <Route path="/seller/dashboard" element={
        <ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>
      } />
      <Route path="/agent/dashboard" element={
        <ProtectedRoute allowedRoles={['agent']}><AgentDashboard /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;