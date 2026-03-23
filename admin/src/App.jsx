import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './AdminContext.jsx';
import RequireAdminAuth from './components/RequireAdminAuth.jsx';
import SidebarLayout from './components/SidebarLayout.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import Customers from './pages/Customers.jsx';
import Blogs from './pages/Blogs.jsx';
import Inventory from './pages/Inventory.jsx';
import Reviews from './pages/Reviews.jsx';
import Coupons from './pages/Coupons.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/*"
        element={
          <RequireAdminAuth>
            <AdminProvider>
              <SidebarLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders/:orderId" element={<OrderDetail />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/blogs" element={<Blogs />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/coupons" element={<Coupons />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </SidebarLayout>
            </AdminProvider>
          </RequireAdminAuth>
        }
      />
    </Routes>
  );
}

export default App;

