import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from './components/SidebarLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Orders from './pages/Orders.jsx';
import Customers from './pages/Customers.jsx';
import Blogs from './pages/Blogs.jsx';
import Inventory from './pages/Inventory.jsx';
import Reviews from './pages/Reviews.jsx';
import Coupons from './pages/Coupons.jsx';
import Settings from './pages/Settings.jsx';

function App() {
  return (
    <SidebarLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
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
  );
}

export default App;

