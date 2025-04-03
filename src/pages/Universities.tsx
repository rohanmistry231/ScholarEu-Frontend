import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilters, { FilterOptions } from '@/components/SearchFilters';
import UniversityCard from '@/components/UniversityCard';
import { University } from '@/lib/types';

const Universities = () => {
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    location: '',
    program: '',
    tuitionRange: '', // Default range
    rating: '', // Default rating
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const universitiesPerPage = 10; // 10 universities per page

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
        const validatedUniversities = universities.map((uni) => ({
          ...uni,
          _id: uni._id || 'missing-id-' + Math.random().toString(36).substr(2, 9),
        }));

        // Sort universities alphabetically by name
        validatedUniversities.sort((a, b) => a.name.localeCompare(b.name));

        setAllUniversities(validatedUniversities);
        setFilteredUniversities(validatedUniversities);
      } catch (err) {
        console.error('Universities - Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setAllUniversities([]);
        setFilteredUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  useEffect(() => {
    if (!Array.isArray(allUniversities)) {
      setFilteredUniversities([]);
      return;
    }

    let result = [...allUniversities];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query) ||
          uni.programs.some((program) => program.toLowerCase().includes(query))
      );
    }

    if (filters.location) {
      result = result.filter((uni) => uni.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.program) {
      result = result.filter((uni) =>
        uni.programs.some((program) => program.toLowerCase().includes(filters.program.toLowerCase()))
      );
    }

    setFilteredUniversities(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchQuery, filters, allUniversities]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredUniversities.length / universitiesPerPage);
  const indexOfLastUniversity = currentPage * universitiesPerPage;
  const indexOfFirstUniversity = indexOfLastUniversity - universitiesPerPage;
  const currentUniversities = filteredUniversities.slice(indexOfFirstUniversity, indexOfLastUniversity);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  return (
    <>
      <Header />
      <main className="pt-16">
        <section className="bg-gray-50 py-4">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-1">Indian Universities</h1>
              <p className="text-sm text-gray-600 mt-0">
                Explore top universities in India and find the perfect match for your academic journey.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-4">
          <div className="container-custom px-6">
            <SearchFilters 
              onSearch={handleSearch} 
              onFilter={handleFilter} 
            />
            {loading ? (
              <div className="text-center py-8">
                <div className="loader"></div>
                <p className="mt-4 text-gray-600">Loading universities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium text-red-600 mb-2">Error</h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filteredUniversities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentUniversities.map((university) => (
                    <UniversityCard
                      key={university._id}
                      university={university}
                      className="card-visible"
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounde  d-lg ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-unicorn-primary text-white hover:bg-unicorn-primary-dark'
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-unicorn-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-unicorn-primary text-white hover:bg-unicorn-primary-dark'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Results Found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Universities;