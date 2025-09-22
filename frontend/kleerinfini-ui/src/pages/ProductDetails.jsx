import React from 'react'
import Header from "../components/Header";
import ProductDetails from "../components/ProductDetails";
import HeroProducts from '../components/HeroProducts';
import ProductListDetails from "../components/ProductListDetails";
import SearchBar from '../components/SearchBar';
import Footer from "../components/Footer";

function Products () {
  return (
    <div>
            <Header />
            <HeroProducts/>
            <SearchBar />
             <ProductDetails />
                      <ProductListDetails />
                   <Footer />
    </div>
    
  )
}

export default Products