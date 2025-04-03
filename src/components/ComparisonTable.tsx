import React, { useState } from 'react';
import { Star, Check, X } from 'lucide-react';
import { University } from '@/lib/types';
import emailjs from 'emailjs-com';

interface ComparisonTableProps {
  universities: University[];
  onRemove: (id: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ universities, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    city: '',
    interestReason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  if (universities.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-xl border border-gray-100">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Universities Selected</h3>
        <p className="text-gray-500">Please select universities to compare.</p>
      </div>
    );
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex mr-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={`${
                star <= Math.floor(rating)
                  ? 'text-yellow-500 fill-yellow-500'
                  : star <= rating
                  ? 'text-yellow-500 fill-yellow-500 opacity-50'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const handleApplyClick = (university: University) => {
    setSelectedUniversity(university);
    setIsModalOpen(true);
    setSubmitStatus(null); // Reset status on new modal open
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUniversity(null);
    setFormData({ name: '', email: '', contactNumber: '', city: '', interestReason: '' }); // Reset form
    setSubmitStatus(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      university_name: selectedUniversity?.name,
      name: formData.name,
      email: formData.email,
      contact_number: formData.contactNumber,
      city: formData.city,
      interest_reason: formData.interestReason,
    };

    emailjs
      .send(
        'service_y45q18l', // Replace with your EmailJS Service ID
        'template_0sca4wc', // Replace with your EmailJS Template ID
        templateParams,
        'Oq-z6yc9UQ9hCrSZE' // Replace with your EmailJS User ID
      )
      .then((response) => {
        console.log('Your inquiry is received. Expect a response within 24 hours!', response.status, response.text);
        setSubmitStatus('success');
        setTimeout(handleModalClose, 2000); // Close modal after 2 seconds
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setSubmitStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-4 border-b border-gray-100 font-medium text-gray-700">Comparison Criteria</th>
                {universities.map((university) => (
                  <th key={university._id} className="p-4 border-b border-gray-100 min-w-[250px]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="university-logo mb-3">
                          <img
                            src={university.logo}
                            alt={university.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-semibold">{university.name}</h3>
                        <p className="text-sm text-gray-500">{university.location}</p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => onRemove(university._id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Rating Row */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium">Rating</td>
                {universities.map((university) => (
                  <td key={`${university._id}-rating`} className="p-4 border-b border-gray-100">
                    {renderRatingStars(university.rating)}
                  </td>
                ))}
              </tr>

              {/* Tuition Fees Row */}
              <tr className="bg-gray-50">
                <td className="p-4 border-b border-gray-100 font-medium">Undergraduate Tuition</td>
                {universities.map((university) => (
                  <td key={`${university._id}-ug-tuition`} className="p-4 border-b border-gray-100">
                    {university.tuitionFees.undergraduate || 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 border-b border-gray-100 font-medium">Postgraduate Tuition</td>
                {universities.map((university) => (
                  <td key={`${university._id}-pg-tuition`} className="p-4 border-b border-gray-100">
                    {university.tuitionFees.postgraduate || 'N/A'}
                  </td>
                ))}
              </tr>

              {/* Accreditation Row */}
              <tr className="bg-gray-50">
                <td className="p-4 border-b border-gray-100 font-medium">Accreditation</td>
                {universities.map((university) => (
                  <td key={`${university._id}-accreditation`} className="p-4 border-b border-gray-100">
                    {university.accreditation}
                  </td>
                ))}
              </tr>

              {/* Student Count Row */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium">Student Count</td>
                {universities.map((university) => (
                  <td key={`${university._id}-student-count`} className="p-4 border-b border-gray-100">
                    {university.studentCount.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Established Year Row */}
              <tr className="bg-gray-50">
                <td className="p-4 border-b border-gray-100 font-medium">Established</td>
                {universities.map((university) => (
                  <td key={`${university._id}-established`} className="p-4 border-b border-gray-100">
                    {university.establishedYear}
                  </td>
                ))}
              </tr>

              {/* Programs Row */}
              <tr>
                <td className="p-4 border-b border-gray-100 font-medium">Key Programs</td>
                {universities.map((university) => (
                  <td key={`${university._id}-programs`} className="p-4 border-b border-gray-100">
                    <ul className="space-y-1">
                      {university.programs.slice(0, 5).map((program, index) => (
                        <li key={`${university._id}-program-${index}`} className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">{program}</span>
                        </li>
                      ))}
                      {university.programs.length > 5 && (
                        <li key={`${university._id}-program-more`} className="text-sm text-gray-500 italic pl-6 mt-1">
                          + {university.programs.length - 5} more
                        </li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Facilities Row */}
              <tr className="bg-gray-50">
                <td className="p-4 border-b border-gray-100 font-medium">Facilities</td>
                {universities.map((university) => (
                  <td key={`${university._id}-facilities`} className="p-4 border-b border-gray-100">
                    <ul className="space-y-1">
                      {university.facilities.slice(0, 3).map((facility, index) => (
                        <li key={`${university._id}-facility-${index}`} className="flex items-center">
                          <Check size={16} className="text-green-500 mr-2" />
                          <span className="text-sm">{facility}</span>
                        </li>
                      ))}
                      {university.facilities.length > 3 && (
                        <li key={`${university._id}-facility-more`} className="text-sm text-gray-500 italic pl-6 mt-1">
                          + {university.facilities.length - 3} more
                        </li>
                      )}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Apply Button Row */}
              <tr>
                <td className="p-4 font-medium">Apply</td>
                {universities.map((university) => (
                  <td key={`${university._id}-apply`} className="p-4">
                    <button
                      onClick={() => handleApplyClick(university)}
                      className="text-unicorn-primary hover:underline font-semibold"
                    >
                      Apply Now
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Application Form */}
      {isModalOpen && selectedUniversity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Apply to {selectedUniversity.name}</h2>
              <button onClick={handleModalClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-unicorn-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-unicorn-primary"
                />
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-unicorn-primary"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Your City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-unicorn-primary"
                />
              </div>
              <div>
                <label htmlFor="interestReason" className="block text-sm font-medium text-gray-700">
                  Why are you interested?
                </label>
                <textarea
                  id="interestReason"
                  name="interestReason"
                  value={formData.interestReason}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-unicorn-primary"
                  placeholder="Tell us why you want to apply to this university..."
                />
              </div>
              {submitStatus === 'success' && (
                <p className="text-green-600">Application submitted successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600">Failed to submit application. Please try again.</p>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-unicorn-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparisonTable;