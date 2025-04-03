import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Award, ArrowRight, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

interface Scholarship {
  _id: string;
  name: string;
  amount: string;
  deadline: string;
  link: string;
}

const ScholarshipsSection: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await fetch('https://unicorner-back.vercel.app/scholarship'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch scholarships');
        }
        const data = await response.json();
        setScholarships(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="pt-12">
        {/* Page Header */}
        <section className="bg-gray-50 py-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-1">Scholarships</h1>
              <p className="text-sm text-gray-600 mt-0">
                Explore top universities in India and find the perfect match for your academic journey.
              </p>
            </div>
          </div>
        </section>

        <div className="scholarships-section p-4 bg-white rounded-lg shadow-sm">
          {/* Search Input */}
          <div className="relative mb-6 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search scholarships..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-500" size={20} />
          </div>

          {/* Show Loader */}
          {loading && (
            <div className="flex justify-center items-center">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          )}

          {/* Show Error Message */}
          {error && <p className="text-red-600 text-center">{error}</p>}

          {/* Scholarship Cards */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              {filteredScholarships.map((scholarship) => (
                <div key={scholarship._id} className="scholarship-card bg-gray-50 p-5 rounded-md shadow hover:shadow-md transition-all border border-blue-400">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-900">{scholarship.name}</h3>
                    <Award className="text-blue-500" size={20} />
                  </div>
                  <p className="text-sm text-gray-700">Amount: <span className="font-medium text-gray-900">{scholarship.amount}</span></p>
                  <p className="text-sm text-gray-700">Deadline: <span className="font-medium text-gray-900">{scholarship.deadline}</span></p>
                  
                  <div className="mt-4 text-right">
                    <Link to={scholarship.link} target="__blank" className="text-blue-600 font-medium flex items-center hover:underline">
                      Apply Now <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default ScholarshipsSection;
