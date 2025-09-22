import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, X, MapPin, Loader, Phone, Mail, MapPinIcon, Award, BarChart3, FileText, ArrowRight } from 'lucide-react';
// import axios from 'axios'; // You'll need to uncomment this in your actual project


// Fix default Leaflet marker icons with custom orange markers
delete L.Icon.Default.prototype._getIconUrl;

// Create custom orange marker
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, #ff6b35, #ff8c42);
        width: 25px;
        height: 25px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(255, 107, 53, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 12px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });
};

// Geocoding function using Nominatim (free OpenStreetMap geocoding service)
const geocodeAddress = async (address, country = 'Algeria') => {
  try {
    // If address is empty, use Algeria center
    if (!address || address.trim() === '') {
      return { latitude: 36.7538, longitude: 3.0588 };
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', ' + country)}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    
    // Fallback to Algeria center if address not found
    console.warn(`Address "${address}" not found, using Algeria center`);
    return { latitude: 36.7538, longitude: 3.0588 };
  } catch (error) {
    console.error('Geocoding error:', error);
    return { latitude: 36.7538, longitude: 3.0588 };
  }
};

// Cache for geocoded locations to avoid repeated API calls
const geocodeCache = new Map();

// Hook to update map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, map.getZoom());
    }
  }, [map, center]);
  return null;
};

export default function Carte({ onClose }) {
  const [producers, setProducers] = useState([]);
  const [filteredProducers, setFilteredProducers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter, setMapCenter] = useState([36.7538, 3.0588]); // Algeria center
  const [loading, setLoading] = useState(true);
  const [geocodingProgress, setGeocodingProgress] = useState({ current: 0, total: 0 });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch producers from database
  useEffect(() => {
    const fetchProducers = async () => {
      try {
        setLoading(true);
        
        // Using fetch (for artifact demo) - replace with axios in your project:
        // const response = await axios.get(`${API_BASE_URL}api/producer-profiles/`);
        // const producersData = response.data;
        
        const response = await fetch(`${API_BASE_URL}api/producers/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const producersData = await response.json();
        
        console.log('Fetched producers data:', producersData); // Debug log
        
        // Geocode all producers
        await geocodeProducers(producersData);
      } catch (error) {
        console.error('Failed to fetch producers:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchProducers();
  }, [API_BASE_URL]);

  // Geocode producers and add coordinates
  const geocodeProducers = async (producersData) => {
    console.log('Starting geocoding for:', producersData.length, 'producers'); // Debug log
    
    const geocodedProducers = [];
    setGeocodingProgress({ current: 0, total: producersData.length });

    for (let i = 0; i < producersData.length; i++) {
      const producer = producersData[i];
      console.log('Processing producer:', producer); // Debug log
      
      setGeocodingProgress({ current: i + 1, total: producersData.length });

      // Use address for geocoding, fallback to company name if no address
      const searchTerm = producer.address && producer.address.trim() !== '' 
        ? producer.address 
        : producer.company_name || 'Algeria'; // Fallback to Algeria if both are empty

      console.log('Geocoding search term:', searchTerm); // Debug log

      // Check cache first
      let coordinates;
      if (geocodeCache.has(searchTerm)) {
        coordinates = geocodeCache.get(searchTerm);
        console.log('Using cached coordinates for:', searchTerm, coordinates);
      } else {
        coordinates = await geocodeAddress(searchTerm);
        console.log('Geocoded coordinates for:', searchTerm, coordinates);
        geocodeCache.set(searchTerm, coordinates);
        
        // Add delay to respect Nominatim rate limiting (1 request per second)
        if (i < producersData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      const geocodedProducer = {
        ...producer,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        geocoded_address: coordinates.display_name || searchTerm
      };
      
      console.log('Final geocoded producer:', geocodedProducer); // Debug log
      geocodedProducers.push(geocodedProducer);
    }

    console.log('All geocoded producers:', geocodedProducers); // Debug log
    setProducers(geocodedProducers);
    setFilteredProducers(geocodedProducers);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredProducers(producers);
      setMapCenter([36.7538, 3.0588]);
      return;
    }

    const filtered = producers.filter(producer => {
      const searchLower = searchTerm.toLowerCase();
      return (
        producer.company_name?.toLowerCase().includes(searchLower) ||
        producer.address?.toLowerCase().includes(searchLower) ||
        producer.user?.email?.toLowerCase().includes(searchLower) ||
        producer.phone?.toLowerCase().includes(searchLower) ||
        producer.user?.first_name?.toLowerCase().includes(searchLower) ||
        producer.user?.last_name?.toLowerCase().includes(searchLower) ||
        `${producer.user?.first_name} ${producer.user?.last_name}`.toLowerCase().includes(searchLower)
      );
    });

    setFilteredProducers(filtered);

    if (filtered.length > 0) {
      // Center map on first result with higher zoom
      setMapCenter([filtered[0].latitude, filtered[0].longitude]);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredProducers(producers);
    setMapCenter([36.7538, 3.0588]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 to-black">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6 text-orange-500" />
          Carte des Producteurs
        </h2>
        <button 
          onClick={onClose} 
          className="bg-orange-500 hover:bg-orange-600 rounded-full p-2 transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search bar */}
      <div className="flex justify-center p-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="bg-white flex rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full border-2 border-orange-100">
          <input
            type="text"
            className="flex-1 px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset"
            placeholder="🔍 Rechercher par nom d'entreprise, propriétaire, adresse, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={handleSearch} 
            className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 text-white flex items-center hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-medium"
          >
            <Search className="w-6 h-6 mr-2" />
            Rechercher
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center pb-4">
          <div className="bg-white rounded-xl px-6 py-3 shadow-lg border border-orange-200">
            <div className="flex items-center gap-3 text-gray-700">
              <Loader className="w-5 h-5 animate-spin text-orange-500" />
              {geocodingProgress.total > 0 ? (
                <span className="font-medium">Géolocalisation... {geocodingProgress.current}/{geocodingProgress.total}</span>
              ) : (
                <span className="font-medium">Chargement des producteurs...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results counter */}
      {!loading && (
        <div className="flex justify-center pb-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full px-6 py-2 font-medium shadow-lg">
            {filteredProducers.length} producteur{filteredProducers.length !== 1 ? 's' : ''} trouvé{filteredProducers.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="flex-1 p-6">
        <MapContainer
          center={mapCenter}
          zoom={6}
          style={{ width: '100%', height: '100%' }}
          className="rounded-2xl shadow-2xl border-4 border-white"
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={mapCenter} />
          
          {!loading && filteredProducers.map((producer) => (
            <Marker
              key={producer.id}
              position={[producer.latitude, producer.longitude]}
              icon={createCustomIcon()}
            >
              {/* Hover tooltip */}
              <Tooltip 
                permanent={false} 
                direction="top" 
                offset={[0, -10]}
                className="custom-tooltip"
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-lg font-medium shadow-lg">
                  🏢 {producer.company_name}
                </div>
              </Tooltip>

              {/* Click popup */}
              <Popup 
                maxWidth={280}
                className="custom-popup"
              >
                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-orange-100" style={{ minWidth: '200px', maxWidth: '280px' }}>
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm break-words">{producer.company_name}</h3>
                        {producer.user?.first_name && producer.user?.last_name && (
                          <p className="text-orange-100 text-xs break-words">
                            {producer.user.first_name} {producer.user.last_name}
                          </p>
                        )}
                      </div>
                      <button 
                        className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200 hover:scale-110 flex-shrink-0"
                        onClick={() => {
                          // Link will be added later
                          console.log('Navigate to producer profile:', producer.id);
                        }}
                        title="Voir le profil"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-2 space-y-1 text-xs">
                    {producer.user?.email && (
                      <div className="border-b border-gray-100 pb-1">
                        <p className="text-gray-500 font-medium">Email</p>
                        <p className="text-gray-800 break-all">{producer.user.email}</p>
                      </div>
                    )}
                    
                    {producer.phone && producer.phone.trim() !== '' && (
                      <div className="border-b border-gray-100 pb-1">
                        <p className="text-gray-500 font-medium">Téléphone</p>
                        <p className="text-gray-800">{producer.phone}</p>
                      </div>
                    )}
                    
                    {producer.address && producer.address.trim() !== '' && (
                      <div className="border-b border-gray-100 pb-1">
                        <p className="text-gray-500 font-medium">Adresse</p>
                        <p className="text-gray-800 break-words">{producer.address}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer with additional info */}
                  {(producer.certifications?.length > 0 || (producer.stats && Object.keys(producer.stats).length > 0) || producer.documents) && (
                    <div className="border-t border-gray-100 p-2 bg-gray-50">
                      <div className="flex flex-wrap gap-1 text-xs">
                        {producer.certifications?.length > 0 && (
                          <span className="bg-orange-100 text-orange-700 px-1 py-0.5 rounded text-xs">
                            {producer.certifications.length} Certifactions
                          </span>
                        )}
                        
                        {producer.stats && Object.keys(producer.stats).length > 0 && (
                          <span className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs">
                            Stats
                          </span>
                        )}
                        
                        {producer.documents && (
                          <span className="bg-green-100 text-green-700 px-1 py-0.5 rounded text-xs">
                            Docs
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}