import React, { useState } from 'react';
import Header from "../components/Header";
import HeroProducts from '../components/HeroProducts';
import SearchSection from '../components/SearchSection';
import ProductGrid from '../components/ProductGrid';
import Footer from "../components/Footer";
import Category from "../components/category";

function Products() {
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [currentRegion, setCurrentRegion] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentCertification, setCurrentCertification] = useState("");

  const handleSearchTrigger = (term, region, category, certification) => {
    setCurrentSearchTerm(term);
    setCurrentRegion(region);
    setCurrentCategory(category);
    setCurrentCertification(certification);
  };

  return (
    <div>
      <Header />
      <HeroProducts />
      <SearchSection onSearch={handleSearchTrigger} />
      <Category />
      <ProductGrid
        searchTerm={currentSearchTerm}
        selectedRegion={currentRegion}
        selectedCategory={currentCategory}
        selectedCertification={currentCertification}
      />
      <Footer />
    </div>
  );
}

export default Products;