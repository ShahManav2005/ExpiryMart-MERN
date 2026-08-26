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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/buyer/dashboard" element={
        <ProtectedRoute allowedRoles={['buyer']}> <ProductListing /> </ProtectedRoute>
      } />
      <Route path='/buyer/product/:id' element={<ProductDetail/>} />
      <Route path='/buyer/cart' element={<Cart />} />
      <Route path="/buyer/checkout" element={<Checkout />} />
      <Route path="/buyer/orders" element={<OrderList />} />
      <Route path="/buyer/orders/:id" element={<OrderStatus />} />
      
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