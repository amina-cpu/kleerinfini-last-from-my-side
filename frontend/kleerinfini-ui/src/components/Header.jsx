import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleProducerRegister = () => {
    navigate("/producer-inscription");
    setIsOpen(false); // Close mobile menu if open
  };

  const handleImportRequest = () => {
    // You can create a route for this or handle it differently
    // For now, I'll assume you want to navigate to a specific page
    // navigate("/import-request");
    console.log("Navigate to import request page");
    setIsOpen(false); // Close mobile menu if open
  };

  const handleLogin = () => {
    // You can create a route for this or handle it differently
    // navigate("/login");
    console.log("Navigate to login page");
    setIsOpen(false); // Close mobile menu if open
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full absolute h-[10vh] top-0 left-0 z-20 text-white bg-transparent backdrop-blur-sm">
      <div className="flex justify-between items-center px-4 ">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={closeMobileMenu}>
            <img src={logo} alt="Logo" className="w-28 h-auto object-contain" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:bg-transparent items-center gap-4 text-sm lg:text-lg">
          
          <button 
            onClick={handleProducerRegister}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition"
          >
            S'inscrire en tant que Producteur
          </button>
          <button 
            onClick={handleImportRequest}
            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition"
          >
            Créer une demande d'importation
          </button>
        </div>
      </div>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-6 text-sm lg:text-lg px-4 lg:px-20 py-2">
        <Link to="/" className="hover:underline">Accueil</Link>
        <Link to="/Products" className="hover:underline">Producteurs</Link>
        <Link to="/products" className="hover:underline">Produits</Link>
        <Link to="/categories" className="hover:underline">Catégories</Link>
        <Link to="/categories" className="hover:underline pl-100"><button onClick={handleLogin} className="hover:underline  ml-100">
            Se connecter / S'inscrire
          </button></Link>
      </div>

      {/* Mobile Dropdown Menu - FIXED VERSION */}
      {isOpen && (
        <div className="lg:hidden px-4 py-3 space-y-3 bg-black/80 backdrop-blur-md text-white shadow-lg border-t border-white/10">
          <Link to="/" className="block hover:underline hover:text-orange-300 transition-colors" onClick={closeMobileMenu}>
            Accueil
          </Link>
          <Link to="/Products" className="block hover:underline hover:text-orange-300 transition-colors" onClick={closeMobileMenu}>
            Producteurs
          </Link>
          <Link to="/products" className="block hover:underline hover:text-orange-300 transition-colors" onClick={closeMobileMenu}>
            Produits
          </Link>
          <Link to="/categories" className="block hover:underline hover:text-orange-300 transition-colors" onClick={closeMobileMenu}>
            Catégories
          </Link>
          <hr className="border-white/20" />
          <button onClick={handleLogin} className="block hover:underline hover:text-orange-300 transition-colors text-left w-full">
            Se connecter / S'inscrire
          </button>
          <button 
            onClick={handleProducerRegister}
            className="w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition-colors"
          >
            S'inscrire en tant que Producteur
          </button>
          <button 
            onClick={handleImportRequest}
            className="w-full bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded font-medium transition-colors"
          >
            Créer une demande d'importation
          </button>
        </div>
      )}
    </header>
  );
}