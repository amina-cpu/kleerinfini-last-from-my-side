import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Fallback images
import image30 from "../assets/image30.jpg";
import image31 from "../assets/image31.jpg";
import image3 from "../assets/image3.jpeg";

// Import all your images
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image4 from "../assets/image4.jpeg";

// Map for imported images by filename
const imageMap = {
  // Category mappings
  "Apiculture": image1,
  "Agriculture": image4,
  "Agroalimentaire": image3,
  "Cosmétique": image2,
  
  // Filename mappings for database images
  "image30.jpg": image30,
  "image31.jpg": image31,
  "image3.jpeg": image3,
  "image1.jpeg": image1,
  "image2.jpeg": image2,
  "image4.jpeg": image4,
  
  // Default fallback images
  default: [image30, image31, image3, image1, image2, image4],
};

const getProductImage = (product, index) => {
  const { images, category_name, image_category } = product;

  // First, try to get image from database images array
  if (images && Array.isArray(images) && images.length > 0) {
    const imageFilename = images[0];
    if (imageMap[imageFilename]) {
      return imageMap[imageFilename];
    }
  }

  // If images is a string instead of array, try that
  if (images && typeof images === 'string' && imageMap[images]) {
    return imageMap[images];
  }

  // Try image_category mapping
  if (image_category && imageMap[image_category]) {
    return imageMap[image_category];
  }

  // Try category_name mapping
  if (category_name && imageMap[category_name]) {
    return imageMap[category_name];
  }

  // Fallback to default images
  const defaults = imageMap.default;
  return defaults[index % defaults.length];
};

export default function ExportProductsSection() {
  const [products, setProducts] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}api/products/`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch export products:", err));
  }, []);

  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-[#f5f2eb] to-[#eee9dd] text-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-black">Produits à l'export</h2>
          <p className="text-lg text-gray-600">Découvrez l'authenticité des produits algériens d'excellence</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <a
              key={product.id || index}
              href="#"
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-[#D2B48C] border-opacity-30 hover:border-opacity-60"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 40px rgba(210,180,140,0.25), 0 8px 16px rgba(210,180,140,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
              <div className="relative overflow-hidden">
                <div className="bg-gradient-to-br from-[#f5f2eb] to-[#ede7d9] p-6">
                  <div className="relative overflow-hidden rounded-xl">
                    <img
                      src={getProductImage(product, index)}
                      alt={product.name}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-black group-hover:text-orange-600 transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {expandedDescriptions[product.id]
                    ? product.description
                    : `${product.description?.slice(0, 100) || ''}...`}
                  {product.description && product.description.length > 100 && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDescription(product.id);
                      }}
                      className="ml-1 text-blue-600 hover:underline text-sm"
                    >
                      {expandedDescriptions[product.id] ? 'Lire moins' : 'Lire plus'}
                    </button>
                  )}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors duration-300">
                    Découvrir →
                  </span>
                  <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors duration-300">
                    <svg
                      className="w-4 h-4 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            className="bg-orange-500 text-white hover:bg-orange-600 font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
            style={{
              boxShadow: "0 4px 20px rgba(249,115,22,0.3)",
            }}
            onClick={() => navigate("/products")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(210,180,140,0.4), 0 4px 16px rgba(249,115,22,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(249,115,22,0.3)";
            }}
          >
            Voir tous les produits
          </button>
        </div>
      </div>
    </section>
  );
}