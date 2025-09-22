import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import Carte from "../components/Carte";
export default function SearchSection({ onSearch, onOpenMap  }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [label, setLabel] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const fetchSuggestions = async (query) => {
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}api/products/`, {
        params: {
          name__icontains: query
        }
      });
      const filteredApiSuggestions = response.data
        .filter(product => product.name && product.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredApiSuggestions);
    } catch (error) {
      console.error("Error fetching products for search suggestions:", error);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const selectSuggestion = (suggestionName) => {
    setSearchTerm(suggestionName);
    setSuggestions([]);
    handleSearch();
  };

  const handleSearch = async () => {
    setLoading(true);
    if (onSearch) {
      onSearch(searchTerm, region, category, label);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
 const [showMap, setShowMap] = useState(false);
  return (
    <section className="py-8 px-3 bg-black text-black">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-2xl font-bold mb-6 text-center text-white"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          Trouvez vos produits d'exportation
        </motion.h2>

        <motion.div
          className="w-full"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <motion.div
            className="w-full bg-[#FAFAF9] mx-auto backdrop-blur-md p-6 rounded-2xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between relative">
              <motion.input
                type="text"
                placeholder="Recherchez un produit ou une région..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyPress={handleKeyPress}
                className="w-full lg:flex-1 rounded-full px-5 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                variants={fadeUp}
                custom={2}
                initial="hidden"
                animate="visible"
              />
              {suggestionsLoading && searchTerm.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg p-2 text-center text-gray-600 flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Chargement des suggestions...
                </div>
              )}
              {!suggestionsLoading && suggestions.length > 0 && (
                <ul className="absolute z-10 top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      className="px-5 py-2 cursor-pointer hover:bg-gray-100 text-gray-800"
                      onClick={() => selectSuggestion(suggestion.name)}
                    >
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}

              <motion.select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                variants={fadeUp}
                custom={3}
                initial="hidden"
                animate="visible"
              >
                <option value="">Région</option>
                <option value="algiers">Alger</option>
                <option value="oran">Oran</option>
                <option value="setif">Sétif</option>
              </motion.select>

              <motion.select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                variants={fadeUp}
                custom={4}
                initial="hidden"
                animate="visible"
              >
                <option value="">Catégorie</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Légumes</option>
                <option value="grains">Céréales</option>
              </motion.select>

              <motion.select
                className="w-full lg:w-auto rounded-full px-5 py-3 border border-gray-300 text-black focus:outline-none"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                variants={fadeUp}
                custom={5}
                initial="hidden"
                animate="visible"
              >
                <option value="">Certification</option>
                <option value="bio">BIO</option>
                <option value="iso">ISO</option>
                <option value="halal">HALAL</option>
              </motion.select>

              <motion.button
                className="w-full lg:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement...
                  </>
                ) : (
                  "Rechercher"
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

     <div className="flex flex-col items-center justify-center h-full mt-10">
          
          <motion.button
            onClick={onOpenMap} // <- calls Homepage state setter
            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-lg transition shadow-md hover:shadow-[0_8px_32px_rgba(210,180,140,0.3)] flex items-center gap-3 mx-auto border border-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <MapPin className="w-6 h-6" />
            Carte Interactive des Producteurs
          </motion.button>
        </div>
      </div>
    </section>
  );
}