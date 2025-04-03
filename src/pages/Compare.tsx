import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComparisonTable from '@/components/ComparisonTable';
import { University } from '@/lib/types';
import { Plus, AlertCircle, X } from 'lucide-react';

const Compare = () => {
  const location = useLocation();
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([]);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const maxCompare = 3;

  // Fetch universities from backend on mount
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('https://unicorner-back.vercel.app/universities');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch universities');
        }
        const result = await response.json();
        if (!result.success) throw new Error(result.message || 'Failed to fetch universities');

        const universities = Array.isArray(result.data) ? result.data : [];
        setAllUniversities(universities);
        setFilteredUniversities(universities);
      } catch (err) {
        console.error('Compare - Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAllUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Check if there's a university ID in the URL query params to add it to comparison
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const addId = params.get('add');

    if (addId && !loading) {
      const uniToAdd = allUniversities.find((uni) => uni._id === addId);
      if (uniToAdd && !selectedUniversities.some((uni) => uni._id === addId)) {
        if (selectedUniversities.length < maxCompare) {
          setSelectedUniversities((prev) => [...prev, uniToAdd]);
        }
      }

      // Remove the query parameter from the URL without reloading the page
      const newUrl = location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location, allUniversities, loading]);

  // Filter universities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUniversities(
        allUniversities.filter(
          (uni) => !selectedUniversities.some((selected) => selected._id === uni._id)
        )
      );
    } else {
      const filtered = allUniversities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedUniversities.some((selected) => selected._id === uni._id)
      );
      setFilteredUniversities(filtered);
    }
  }, [searchTerm, selectedUniversities, allUniversities]);

  const handleAddUniversity = (university: University) => {
    if (selectedUniversities.length < maxCompare) {
      setSelectedUniversities((prev) => [...prev, university]);
      setSearchTerm('');
      setIsSelectionOpen(false);
    }
  };

  const handleRemoveUniversity = (id: string) => {
    setSelectedUniversities((prev) => prev.filter((uni) => uni._id !== id));
  };

  const toggleSelectionPanel = () => {
    setIsSelectionOpen(!isSelectionOpen);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-custom pt-32 pb-16 text-center">
          <div className="loader"></div>
          <p className="mt-4 text-gray-600">Loading universities...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container-custom pt-32 pb-16 text-center">
          <p className="text-red-600">{error}</p>
          <Link to="/universities" className="mt-4 inline-block text-unicorn-primary hover:underline">
            Back to Universities
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="pt-14">
        <section className="bg-gray-50 py-4">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-1">Compare Universities</h1>
              <p className="text-sm text-gray-600 mt-0">
              Compare multiple universities side-by-side to find the best match for your educational goals.
              </p>
            </div>
          </div>
        </section>

        <section className="py-6">
          <div className="container-custom">
            {/* University Selection Section */}
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Select Universities to Compare</h2>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  You can compare up to {maxCompare} universities at once.
                  {selectedUniversities.length > 0 &&
                    ` Currently comparing ${selectedUniversities.length} ${
                      selectedUniversities.length === 1 ? 'university' : 'universities'
                    }.`}
                </p>
                
                {selectedUniversities.length >= maxCompare && (
                  <div className="flex items-center bg-amber-50 text-amber-700 p-3 rounded-lg mt-2">
                    <AlertCircle size={18} className="mr-2" />
                    <p className="text-sm">
                      You've reached the maximum number of universities to compare. Remove one to add another.
                    </p>
                  </div>
                )}
              </div>

              {/* Selected Universities Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {selectedUniversities.map((uni) => (
                  <div key={uni._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
                    <button 
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveUniversity(uni._id)}
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center mb-2">
                      <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-medium text-sm">{uni.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500">{uni.location}</p>
                  </div>
                ))}
                
                {/* Add University Tile */}
                {selectedUniversities.length < maxCompare && (
                  <div 
                    className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300 flex flex-col items-center justify-center min-h-24 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={toggleSelectionPanel}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <Plus size={24} className="text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600 text-center">Add University</p>
                  </div>
                )}
              </div>

              {/* University Selection Panel */}
              {isSelectionOpen && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Select a University</h3>
                    <button 
                      className="text-gray-400 hover:text-gray-600"
                      onClick={() => setIsSelectionOpen(false)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search universities..."
                    className="input-field mb-4 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <div className="max-h-72 overflow-y-auto">
                    {filteredUniversities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredUniversities.map((uni) => (
                          <div
                            key={uni._id}
                            className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg border border-gray-100 flex items-center"
                            onClick={() => handleAddUniversity(uni)}
                          >
                            <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                              <img src={uni.logo} alt={uni.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="overflow-hidden">
                              <h4 className="font-medium text-sm truncate">{uni.name}</h4>
                              <p className="text-xs text-gray-500 truncate">{uni.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No universities found matching your search.</p>
                    )}
                  </div>
                </div>
              )}

              {selectedUniversities.length === 0 && !isSelectionOpen && (
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 mb-4">
                    Start by adding universities to compare.
                  </p>
                  <button onClick={toggleSelectionPanel} className="btn-primary">
                    Add Universities
                  </button>
                </div>
              )}
            </div>

            {/* Comparison Table */}
            {selectedUniversities.length > 0 && (
              <ComparisonTable universities={selectedUniversities} onRemove={handleRemoveUniversity} />
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Compare;