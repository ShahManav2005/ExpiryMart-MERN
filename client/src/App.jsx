import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import SellerDashboard from './pages/seller/SellerDashboard'
import AgentDashboard from './pages/agent/AgentDashboard'
import ProductListing from './pages/buyer/ProductListing' 
import ProductDetail from './pages/buyer/ProductDetails'
import Cart from './pages/buyer/Cart'
import Checkout from './pages/buyer/Checkout'
import OrderList from './pages/buyer/OrderList'
import OrderStatus from './pages/buyer/OrderStatus'
import Layout from './components/Layout'
import Profile from './pages/buyer/Profile'
import AgentProfile from './pages/agent/AgentProfile'
import AddProduct from './pages/seller/AddProduct'
import SalesHistory from './pages/seller/SalesHistory'
import SellerProfile from './pages/seller/SellerProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/buyer/dashboard" element={
        <ProtectedRoute allowedRoles={['buyer']}> <Layout><ProductListing /></Layout></ProtectedRoute>
      } />
      
      <Route path="/buyer/product/:id" element={<Layout><ProductDetail /></Layout>} />
      <Route path="/buyer/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/buyer/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/buyer/orders" element={<Layout><OrderList /></Layout>} />
      <Route path="/buyer/orders/:id" element={<Layout><OrderStatus /></Layout>} />
      <Route path="/buyer/profile" element={
        <ProtectedRoute allowedRoles={['buyer']}><Layout><Profile /></Layout></ProtectedRoute>
      } />
      
      <Route path="/seller/dashboard" element={
        <ProtectedRoute allowedRoles={['seller']}><Layout><SellerDashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/seller/add-product" element={
        <ProtectedRoute allowedRoles={['seller']}><Layout><AddProduct /></Layout></ProtectedRoute>
      } />
      <Route path="/seller/history" element={
        <ProtectedRoute allowedRoles={['seller']}><Layout><SalesHistory /></Layout></ProtectedRoute>
      } />
      <Route path="/seller/profile" element={
        <ProtectedRoute allowedRoles={['seller']}><Layout><SellerProfile /></Layout></ProtectedRoute>
      } />

      <Route path="/agent/dashboard" element={
        <ProtectedRoute allowedRoles={['agent']}><Layout><AgentDashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/agent/profile" element={
        <ProtectedRoute allowedRoles={['agent']}><Layout><AgentProfile /></Layout></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App;