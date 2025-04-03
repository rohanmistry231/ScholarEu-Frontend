import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StudentAmbassador } from '@/lib/types';
import { MessageSquare, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from 'emailjs-com';

const StudentConnect = () => {
  const [allAmbassadors, setAllAmbassadors] = useState<StudentAmbassador[]>([]);
  const [filteredAmbassadors, setFilteredAmbassadors] = useState<StudentAmbassador[]>([]);
  const [universities, setUniversities] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [displayedAmbassadors, setDisplayedAmbassadors] = useState<StudentAmbassador[]>([]);

  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmbassador, setSelectedAmbassador] = useState<StudentAmbassador | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch ambassadors and universities on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const ambResponse = await fetch('https://unicorner-back.vercel.app/students');
        if (!ambResponse.ok) throw new Error('Failed to fetch student ambassadors');
        const ambResult = await ambResponse.json();
        if (!ambResult.success) throw new Error(ambResult.message || 'API returned unsuccessful response');
        const ambassadors: StudentAmbassador[] = ambResult.data || [];
        setAllAmbassadors(ambassadors);
        setFilteredAmbassadors(ambassadors);

        const universityIds = [...new Set(ambassadors.map((a) => a.universityId))];
        const uniPromises = universityIds.map(async (id) => {
          try {
            const uniResponse = await fetch(`https://unicorner-back.vercel.app/universities/${id}`);
            if (!uniResponse.ok) return { id, name: 'Unknown University' };
            const uniResult = await uniResponse.json();
            return { id, name: uniResult.data?.name || 'Unknown University' };
          } catch (err) {
            console.warn(`Failed to fetch university ${id}:`, err);
            return { id, name: 'Unknown University' };
          }
        });

        const uniResults = await Promise.all(uniPromises);
        const uniMap = uniResults.reduce((acc: Record<string, string>, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});
        setUniversities(uniMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter ambassadors based on search query
  useEffect(() => {
    let result = [...allAmbassadors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((ambassador) =>
        [ambassador.name, universities[ambassador.universityId], ambassador.program]
          .some((field) => field?.toLowerCase().includes(query))
      );
    }

    setFilteredAmbassadors(result);
    setCurrentPage(1);
  }, [searchQuery, allAmbassadors, universities]);

  // Update pagination
  useEffect(() => {
    const total = Math.ceil(filteredAmbassadors.length / studentsPerPage);
    setTotalPages(total || 1);

    const startIndex = (currentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;
    const currentStudents = filteredAmbassadors.slice(startIndex, endIndex);

    setDisplayedAmbassadors(currentStudents);
  }, [filteredAmbassadors, currentPage, studentsPerPage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: document.getElementById('ambassadors-section')?.offsetTop || 0, behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  // Handle connect button click
  const handleConnectClick = (ambassador: StudentAmbassador) => {
    setSelectedAmbassador(ambassador);
    setIsModalOpen(true);
    setFormData({ name: '', email: '', city: '', phone: '', message: '' });
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbassador) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const templateParams = {
      userName: formData.name,
      userEmail: formData.email,
      userCity: formData.city,
      userPhone: formData.phone,
      message: formData.message,
      ambassadorName: selectedAmbassador.name,
      ambassadorContact: selectedAmbassador.contactInfo,
      universityName: universities[selectedAmbassador.universityId] || 'Unknown University',
    };

    try {
      await emailjs.send(
        'service_wb00ivb', // Replace with your EmailJS service ID
        'template_omhiv36', // Replace with your EmailJS template ID (e.g., student_connect_request)
        templateParams,
        '0YDfUik5ymZEa3qTM' // Replace with your EmailJS user ID
      );

      setSuccessMessage('Your inquiry is received. Expect a response within 24 hours!');
      setFormData({ name: '', email: '', city: '', phone: '', message: '' });
    } catch (error) {
      setErrorMessage('Failed to send your request. Please try again later.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    }
  };

  return (
    <>
      <Header />
      <main className="pt-14 pb-0 overflow-x-hidden">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-unicorn-primary/10 to-unicorn-secondary/10 py-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-1">Connect with Real University Students</h1>
              <p className="text-sm text-gray-600 mt-0">
                Get authentic insights about universities directly from current students and alumni who have experienced it firsthand.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-2 bg-white border-b border-gray-200">
          <div className="container-custom">
            <div className="bg-white rounded-xl shadow-soft p-0">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, university, or program"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unicorn-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Student Ambassadors Section */}
        <section id="ambassadors-section" className="py-4 text-center">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-4">Student Ambassadors</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="loader"></div>
                <p className="mt-4 text-gray-600">Loading ambassadors...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium text-red-600 mb-2">Error</h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filteredAmbassadors.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedAmbassadors.map((ambassador) => (
                    <div
                      key={ambassador._id}
                      className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start">
                          <img
                            src={ambassador.profileImage || '/images/default-profile.jpg'}
                            alt={ambassador.name}
                            className="w-16 h-16 rounded-full mr-4 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/images/default-profile.jpg';
                            }}
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{ambassador.name}</h3>
                            <p className="text-gray-600 text-sm">
                              {ambassador.program} | Year {ambassador.year}
                            </p>
                            <p className="text-unicorn-primary font-medium text-sm mt-1">
                              {universities[ambassador.universityId] || 'Unknown University'}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-700 line-clamp-3">{ambassador.about}</p>
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => handleConnectClick(ambassador)}
                            className="flex items-center bg-unicorn-primary text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-unicorn-primary/90 transition-colors"
                          >
                            <MessageSquare size={16} className="mr-2" />
                            Connect
                          </button>
                          <span className="text-xs text-gray-500">
                            Joined {new Date(ambassador.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center">
                    <button
                      onClick={goToPreviousPage}
                      className={`p-2 rounded-l-lg border border-gray-300 ${
                        currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {getPageNumbers().map((number) => (
                      <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`px-4 py-2 border-t border-b border-gray-300 ${
                          currentPage === number
                            ? 'bg-unicorn-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={goToNextPage}
                      className={`p-2 rounded-r-lg border border-gray-300 ${
                        currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-center text-sm text-gray-500">
                  Showing {displayedAmbassadors.length} of {filteredAmbassadors.length} ambassadors | Page {currentPage} of {totalPages}
                </div>
              </>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Ambassadors Found</h3>
                <p className="text-gray-500">Try adjusting your search.</p>
              </div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-6 bg-gray-50">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl font-bold mb-4">How Student Connect Works</h2>
              <p className="text-gray-700">
                Connect with student ambassadors in three simple steps and get firsthand insights about university life.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 text-center shadow-soft">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary text-white flex items-center justify-center mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold text-lg mb-3">Find Your Match</h3>
                <p className="text-gray-600">
                  Search for student ambassadors from your desired university or program.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-soft">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary text-white flex items-center justify-center mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold text-lg mb-3">Connect & Chat</h3>
                <p className="text-gray-600">
                  Send a connection request and start chatting with your chosen ambassador.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-soft">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary text-white flex items-center justify-center mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold text-lg mb-3">Get Insider Insights</h3>
                <p className="text-gray-600">
                  Receive authentic information about academics, campus life, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Connect Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogTitle>Connect with {selectedAmbassador?.name}</DialogTitle>
          <p id="dialog-description" className="text-gray-600 text-sm mb-4">
            Fill out the form below to send a connection request to {selectedAmbassador?.name}.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleInputChange}
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
            <Input
              name="city"
              placeholder="Your City"
              required
              value={formData.city}
              onChange={handleInputChange}
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
            <Textarea
              name="message"
              placeholder="Your Message"
              rows={4}
              required
              value={formData.message}
              onChange={handleInputChange}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </form>
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
};

export default StudentConnect;