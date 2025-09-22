import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

// --- Local Image Imports ---
import image30 from "../assets/image30.jpg";
import image31 from "../assets/image31.jpg";
import image3 from "../assets/image3.jpeg";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image4 from "../assets/image4.jpeg";

// Create a robust image mapping system
const createImageMap = () => {
  const images = {
    image30,
    image31,
    image3,
    image1,
    image2,
    image4,
  };
  
  const map = {};
  Object.entries(images).forEach(([key, value]) => {
    map[key] = value;
    const extension = value.split('.').pop();
    if (extension) {
      map[key + '.' + extension] = value;
    }
  });
  
  return map;
};

const imageMap = createImageMap();
// --- End of Image Imports ---

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Enhanced function to get product image - handles nested objects
  const getProductImage = (imageData) => {
    let imageName = null;

    if (imageData && typeof imageData === 'object' && imageData.image) {
      imageName = imageData.image;
    } else if (imageData && typeof imageData === 'string') {
      imageName = imageData;
    }
    
    if (imageName && imageMap[imageName]) {
      return imageMap[imageName];
    }
    
    if (imageName) {
      const nameWithoutExtension = imageName.split('.')[0];
      if (imageMap[nameWithoutExtension]) {
        return imageMap[nameWithoutExtension];
      }
    }
    
    return null;
  };

  useEffect(() => {
    if (!id) {
      setError("L'ID du produit est manquant dans l'URL.");
      setLoading(false);
      return;
    }

    const fetchProductAndCategories = async () => {
      try {
        const productRes = await axios.get(`${API_BASE_URL}api/products/${id}/`);
        const fetchedProduct = productRes.data;
        
        setProduct(fetchedProduct);

        let mainImageSrc = getProductImage(fetchedProduct.image);
        if (!mainImageSrc && fetchedProduct.images) {
          if (Array.isArray(fetchedProduct.images) && fetchedProduct.images.length > 0) {
            mainImageSrc = getProductImage(fetchedProduct.images[0]);
          } else if (typeof fetchedProduct.images === 'object' && fetchedProduct.images.image) {
            mainImageSrc = getProductImage(fetchedProduct.images.image);
          } else if (typeof fetchedProduct.images === 'string') {
            mainImageSrc = getProductImage(fetchedProduct.images);
          }
        }
        setMainImage(mainImageSrc);

        const categoriesRes = await axios.get(`${API_BASE_URL}api/categories/`);
        setCategories(categoriesRes.data);
        setLoading(false);
      } catch (err) {
        console.error(`Erreur lors de la récupération des données pour l'ID ${id}:`, err);
        if (err.response && err.response.status === 404) {
          setError("Produit non trouvé. L'ID pourrait être incorrect.");
        } else {
          setError("Échec du chargement des détails du produit ou des catégories. Veuillez vérifier la connexion au serveur.");
        }
        setLoading(false);
      }
    };

    fetchProductAndCategories();
  }, [id, API_BASE_URL]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Catégorie inconnue";
  };

  // Simplified loading, error, and not found states
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#f5f2eb] to-[#f0ede5] min-h-screen flex items-center justify-center pt-20">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Chargement des détails du produit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-[#f5f2eb] to-[#f0ede5] min-h-screen flex items-center justify-center pt-20">
        <div className="bg-white border-l-4 border-red-500 p-8 rounded-lg shadow-xl max-w-md">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-full mr-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800">Erreur!</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md"
          >
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  // Determine which images to show in the thumbnail gallery
  let thumbnailImages = [];
  if (product.images) {
    if (Array.isArray(product.images)) {
      thumbnailImages = product.images.filter(img => getProductImage(img) !== null);
    } else if (typeof product.images === 'object' && product.images.image) {
      if (getProductImage(product.images.image) !== null) {
        thumbnailImages = [product.images.image];
      }
    } else if (typeof product.images === 'string') {
      if (getProductImage(product.images) !== null) {
        thumbnailImages = [product.images];
      }
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#f5f2eb] to-[#f0ede5] min-h-screen px-4 pt-20 relative">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Retour"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col items-center justify-center">
              {/* Main Image */}
              {mainImage ? (
                <div className="relative group mb-3 w-full flex justify-center">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="rounded-xl shadow-xl object-cover w-full max-w-[400px] h-[300px] lg:h-[400px] transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl"
                    onError={() => setMainImage(null)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                </div>
              ) : (
                <div className="relative group mb-3 w-full flex justify-center">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg w-full max-w-[400px] h-[300px] lg:h-[400px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p className="font-medium text-sm">Image non disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Thumbnail Gallery */}
              {thumbnailImages.length > 0 && (
                <div className="flex space-x-3 overflow-x-auto p-2">
                  {thumbnailImages.map((imgData, index) => {
                    const localImage = getProductImage(imgData);
                    return (
                      <img
                        key={index}
                        src={localImage}
                        alt={`Thumbnail ${index}`}
                        className={`w-16 h-16 object-cover rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                          localImage === mainImage ? "ring-3 ring-offset-2 ring-blue-500 scale-105" : "hover:scale-105 hover:shadow-lg"
                        }`}
                        onClick={() => setMainImage(localImage)}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 lg:p-8">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900 leading-tight">
                  {product.name}
                </h1>
                {product.category && (
                  <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium mb-3">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    {getCategoryName(product.category)}
                  </div>
                )}
                {product.region_org && (
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="font-medium">Origine: {product.region_org}</span>
                  </div>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border border-emerald-200 rounded-xl p-5 mb-6">
                {product.prix_indicatif && product.prix_indicatif > 0 ? (
                  <div className="text-center">
                    <p className="text-sm text-emerald-600 font-medium mb-1">Prix Indicatif</p>
                    <p className="text-3xl font-bold text-emerald-700">${Number(product.prix_indicatif).toFixed(2)}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-orange-700 mb-1">Prix sur demande</p>
                    <p className="text-sm text-gray-600">Contactez-nous pour un devis personnalisé</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {product.cle_min && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                      </svg>
                      <span className="text-sm font-medium text-blue-800">Quantité Min.</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-900">{product.cle_min}</p>
                  </div>
                )}
                {product.delai_production && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm font-medium text-purple-800">Délai Production</span>
                    </div>
                    <p className="text-lg font-semibold text-purple-900">{product.delai_production}</p>
                  </div>
                )}
              </div>
              
              {product.description && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
                </div>
              )}
              
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z"></path>
                  </svg>
                  Quantité souhaitée
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white border border-gray-300 text-gray-600 w-8 h-8 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-gray-300 rounded-lg py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-white border border-gray-300 text-gray-600 w-8 h-8 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {product.fiche_tech && (
                <div className="mb-6">
                  <a
                    href={`${API_BASE_URL}media/${product.fiche_tech}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-slate-100 to-gray-100 border border-slate-300 text-slate-700 px-4 py-2.5 rounded-lg hover:from-slate-200 hover:to-gray-200 transition-all duration-300 shadow-sm text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Fiche technique (PDF)
                  </a>
                </div>
              )}
              
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3 rounded-lg hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center group">
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  Contacter le fournisseur
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    Demander un devis
                  </button>
                  <button className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2.5 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center justify-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 3H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"></path>
                    </svg>
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;