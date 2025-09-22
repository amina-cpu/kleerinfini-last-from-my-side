import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import all local images
import image30 from "../assets/image30.jpg";
import image31 from "../assets/image31.jpg";
import image3 from "../assets/image3.jpeg";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";
import image4 from "../assets/image4.jpeg";

// Map imported images by filename for direct lookup.
const imageMap = {
  "image30.jpg": image30,
  "image31.jpg": image31,
  "image3.jpeg": image3,
  "image1.jpeg": image1,
  "image2.jpeg": image2,
  "image4.jpeg": image4,
};

console.log('Available images in imageMap:', Object.keys(imageMap)); // Debug log

const ProductGrid = ({ searchTerm, selectedRegion, selectedCategory, selectedCertification }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  
  const [sidebarOptions, setSidebarOptions] = useState({
    categories: [],
    regions: []
  });
  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    regions: []
  });

  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const toggleDescription = (productId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Enhanced debugging function
  const getProductImage = (product) => {
    console.log('=== IMAGE DEBUG ===');
    console.log('Full product object:', product);
    console.log('product.image:', product.image);
    console.log('product.images:', product.images);
    console.log('typeof product.image:', typeof product.image);
    console.log('typeof product.images:', typeof product.images);
    console.log('Available imageMap keys:', Object.keys(imageMap));
    
    let imageName = null;
    
    // Handle single image field (string)
    if (product.image && typeof product.image === 'string') {
      imageName = product.image;
      console.log('Using single image field:', imageName);
    }
    // Handle case where product.image is an object with nested image property
    else if (product.image && typeof product.image === 'object' && product.image.image) {
      imageName = product.image.image;
      console.log('Using nested image object:', imageName);
    }
    // Handle images array (JSONField)
    else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      // If array contains objects with image property
      if (typeof firstImage === 'object' && firstImage.image) {
        imageName = firstImage.image;
        console.log('Using first image from object array:', imageName);
      } else if (typeof firstImage === 'string') {
        imageName = firstImage;
        console.log('Using first image from string array:', imageName);
      }
    }
    // Handle case where images is an object with nested image property
    else if (product.images && typeof product.images === 'object' && product.images.image) {
      imageName = product.images.image;
      console.log('Using nested images object:', imageName);
    }
    // Handle case where images is a string (sometimes APIs return JSON as string)
    else if (product.images && typeof product.images === 'string') {
      try {
        const parsedImages = JSON.parse(product.images);
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          const firstImage = parsedImages[0];
          if (typeof firstImage === 'object' && firstImage.image) {
            imageName = firstImage.image;
            console.log('Using first image from parsed object array:', imageName);
          } else {
            imageName = firstImage;
            console.log('Using first image from parsed string array:', imageName);
          }
        } else if (parsedImages.image) {
          imageName = parsedImages.image;
          console.log('Using image from parsed object:', imageName);
        }
      } catch (e) {
        // If it's not valid JSON, treat it as a filename
        imageName = product.images;
        console.log('Using images string as filename:', imageName);
      }
    }
    
    if (imageName) {
      const resolvedImage = imageMap[imageName];
      console.log('Image name:', imageName);
      console.log('Resolved image:', resolvedImage);
      console.log('Image exists in map:', !!resolvedImage);
      return resolvedImage;
    }
    
    console.log('No image found');
    console.log('=== END IMAGE DEBUG ===');
    return null;
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching from:', `${API_BASE_URL}api/products/`);
        const res = await axios.get(`${API_BASE_URL}api/products/`);
        const fetchedProducts = res.data;
        
        console.log('=== API RESPONSE DEBUG ===');
        console.log('Total products fetched:', fetchedProducts.length);
        console.log('First product:', fetchedProducts[0]);
        console.log('First product image field:', fetchedProducts[0]?.image);
        console.log('First product images field:', fetchedProducts[0]?.images);
        console.log('=== END API DEBUG ===');
        
        setAllProducts(fetchedProducts);

        const uniqueCategories = [...new Set(fetchedProducts
          .map(p => p.category?.name)
          .filter(Boolean))];
        const uniqueRegions = [...new Set(fetchedProducts
          .map(p => p.region_org)
          .filter(Boolean))];
          
        setSidebarOptions({
          categories: uniqueCategories,
          regions: uniqueRegions
        });

      } catch (err) {
        console.error('Error fetching all products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [API_BASE_URL]);

  useEffect(() => {
    let filteredProducts = allProducts;

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product =>
            product.category && product.category.name.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    if (selectedRegion) {
        filteredProducts = filteredProducts.filter(product =>
            product.region_org && product.region_org.toLowerCase() === selectedRegion.toLowerCase()
        );
    }
    
    if (sidebarFilters.categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.category && sidebarFilters.categories.includes(product.category.name)
      );
    }
    
    if (sidebarFilters.regions.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.region_org && sidebarFilters.regions.includes(product.region_org)
      );
    }

    setDisplayedProducts(filteredProducts);
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedCategory, sidebarFilters, allProducts]);

  const handleSidebarFilter = (filterType, value) => {
    setSidebarFilters(prev => {
      const newFilterValues = prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value];
      return {
        ...prev,
        [filterType]: newFilterValues
      };
    });
  };
  
  const clearAllFilters = () => {
    setSidebarFilters({
      categories: [],
      regions: []
    });
  };

  const totalPagesFiltered = Math.ceil(displayedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = displayedProducts.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pageNumbers = [];
    if (totalPagesFiltered <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesFiltered; i++) pageNumbers.push(i);
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPagesFiltered);
      if (end - start < maxVisiblePages - 1) start = Math.max(end - maxVisiblePages + 1, 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const StarRating = ({ rating = 0, reviewCount = 0 }) => (
    <div className="flex items-center gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={`${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">{reviewCount} reviews</span>
    </div>
  );

  const Pagination = () => {
    if (totalPagesFiltered <= 1) return null;
    const pageNumbers = getPageNumbers();

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}

        {pageNumbers.map(num => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              currentPage === num
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {num}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPagesFiltered && (
          <>
            <span className="px-2 text-gray-500">...</span>
            <button
              onClick={() => handlePageChange(totalPagesFiltered)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {totalPagesFiltered}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPagesFiltered}
          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
            currentPage === totalPagesFiltered
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Next <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-[#f5f2eb] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-[#f5f2eb] min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2">There was an issue fetching the products.</p>
        </div>
      </div>
    );
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-[#f5f2eb] min-h-screen">
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          <button
            onClick={clearAllFilters}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#f5f2eb] min-h-screen flex gap-8">
      <div className="w-64 bg-white rounded-lg shadow-sm p-6 h-fit sticky top-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <CheckboxSection
          title="Categories"
          options={sidebarOptions.categories}
          selected={sidebarFilters.categories}
          onToggle={handleSidebarFilter}
        />

        <CheckboxSection
          title="Regions"
          options={sidebarOptions.regions}
          selected={sidebarFilters.regions}
          onToggle={handleSidebarFilter}
        />

        <button
          onClick={clearAllFilters}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        >
          Clear All Filters
        </button>
      </div>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, displayedProducts.length)} of {displayedProducts.length} products
          </p>
          <p className="text-sm text-gray-500">Page {currentPage} of {totalPagesFiltered}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => {
            const productImage = getProductImage(product);
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-full h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden relative">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', productImage);
                        e.target.style.display = 'none';
                        // Show fallback
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">No Image</div>';
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', productImage);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 flex-col">
                      <div>No Image Available</div>
                      <div className="text-xs mt-1">
                        {typeof (product.image || product.images) === 'object' 
                          ? JSON.stringify(product.image || product.images) 
                          : (product.image || product.images || 'No image data')
                        }
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {expandedDescriptions[product.id]
                      ? product.description
                      : `${product.description?.slice(0, 100) || ''}...`}
                    {product.description && product.description.length > 100 && (
                      <button
                        onClick={() => toggleDescription(product.id)}
                        className="ml-1 text-blue-600 hover:underline text-sm"
                      >
                        {expandedDescriptions[product.id] ? 'Lire moins' : 'Lire plus'}
                      </button>
                    )}
                  </p>
                  {product.delai_production && <p className="text-sm text-gray-700"><strong>Délai production:</strong> {product.delai_production}</p>}
                  {typeof product.est_pret === 'boolean' && <p className="text-sm text-gray-700"><strong>Prêt:</strong> {product.est_pret ? "Oui" : "Non"}</p>}
                  {product.region_org && <p className="text-sm text-gray-700"><strong>Région:</strong> {product.region_org}</p>}
                  {product.langue_du_product && <p className="text-sm text-gray-700"><strong>Langue:</strong> {product.langue_du_product}</p>}
                  {product.category && <p className="text-sm text-gray-700">
                    <strong>Catégorie:</strong> {product.category.name}
                  </p>}
                   {product.category && <p className="text-sm text-gray-700">
                    <strong>Certificats:</strong> {product.category.name}
                  </p>}

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      ${Number(product.prix_indicatif || product.price || 0).toFixed(2)}
                    </span>
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium">
                      Quick Buy
                    </button>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className="hover:underline text-blue-600 text-sm inline-block"
                  > Voir plus
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <Pagination />
      </div>
    </div>
  );
};

const CheckboxSection = ({ title, options, selected, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
      </div>
      {isExpanded && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label key={option} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => onToggle(title.toLowerCase(), option)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="ml-3 text-sm text-gray-700 select-none">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;