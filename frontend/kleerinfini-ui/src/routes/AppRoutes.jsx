import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProducerProfile from '../pages/ProducerProfile';
import ProducerRegister from '../pages/ProducerRegister';
import Homepage from '../pages/Homepage';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<Products />} /> {/* Changed /Products to /products for consistency, but not strictly required */}
        {/* THIS IS THE CRITICAL CHANGE */}
         <Route path="/product/:id" element={<ProductDetails />} />
        {/* Keep the original /ProductDetails if you also want a generic page, but likely you don't */}
        {/* If you specifically want the path to be /ProductDetails/:id then change the Link in ProductGrid accordingly */}
        
        <Route path="/producer/:id" element={<ProducerProfile />} />
        <Route path="/producer-inscription" element={<ProducerRegister />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;