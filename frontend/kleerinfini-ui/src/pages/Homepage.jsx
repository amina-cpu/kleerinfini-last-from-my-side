import React, { useState } from "react";

import BussinesSection from "../components/BussinesSection";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import ExportProductsSection from "../components/ExportProductsSection";
import StepsGuideSection from "../components/StepsGuideSection";
import Whychoose from "../components/Whychoose";
import Signup from "../components/Signup";
import Footer from "../components/Footer";
import AboutPreview from "../components/AboutPreview";
import Category from "../components/category";
import Carte from "../components/Carte";

function Homepage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      <Header />
      <HeroSection />

      {/* Pass the function down */}
     <SearchSection onOpenMap={() => setShowMap(true)} />

      {showMap && <Carte onClose={() => setShowMap(false)} />}

      <Category />
      <ExportProductsSection />
      <Signup />
      <BussinesSection />
      <StepsGuideSection />
      <Whychoose />
      <AboutPreview />
      <Footer />
    </div>
  );
}

export default Homepage;
