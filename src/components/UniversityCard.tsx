import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { University } from '@/lib/types';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from 'emailjs-com';

interface UniversityCardProps {
  university: University;
  className?: string;
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    universityLocation: `${university.location}, ${university.country}`, // Prepopulated
    program: '',
    city: '', // New field for applicant's city
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      universityName: university.name,
      universityLocation: formData.universityLocation,
      program: formData.program,
      city: formData.city, // Added city to EmailJS params
    };

    try {
      // Send the form data to EmailJS
      await emailjs.send(
        'service_y45q18l', // Replace with your EmailJS service ID
        'template_3k730yv', // Replace with your EmailJS template ID
        templateParams,
        'Oq-z6yc9UQ9hCrSZE' // Replace with your EmailJS user ID
      );

      setSuccessMessage('Your inquiry is received. Expect a response within 24 hours!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        universityLocation: `${university.location}, ${university.country}`, // Reset to default
        program: '',
        city: '', // Reset city field
      });
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    } catch (error) {
      setErrorMessage('There was an error submitting your application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingStars = (rating: number) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          className={`${
            star <= Math.floor(rating)
              ? 'text-yellow-500 fill-yellow-500'
              : star <= rating
              ? 'text-yellow-500 fill-yellow-500 opacity-50'
              : 'text-gray-300'
          } mr-1`}
        />
      ))}
      <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div
      className={`p-2 university-card border border-blue-400 rounded-xl shadow-soft bg-white ${className} flex flex-col justify-between`}
    >
      <div className="p-3 flex-grow">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold line-clamp-2">{university.name}</h3>
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
            {renderRatingStars(university.rating)}
          </div>
        </div>

        <div className="flex items-center mt-2 text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">
            {university.location}, {university.country}
          </span>
        </div>
      </div>

      <div className="p-2 flex justify-between border-t border-gray-100">
        <Link
          to={`/university/${university._id}`}
          className="text-green-600 font-medium hover:underline flex items-center"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-medium flex items-center px-3 py-1"
        >
          Apply Now
          <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>

      {/* Application Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle>Apply for {university.name}</DialogTitle>
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
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
            {/* University Location Field (Read-Only) */}
            <Input
              name="universityLocation"
              placeholder="University Location"
              value={formData.universityLocation}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
            {/* Program Dropdown */}
            <select
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-unicorn-primary focus:border-transparent"
            >
              <option value="">Select a Program</option>
              {university.programs.map((program, index) => (
                <option key={index} value={program}>
                  {program}
                </option>
              ))}
            </select>
            {/* New City Field */}
            <Input
              name="city"
              placeholder="Your City"
              required
              value={formData.city}
              onChange={handleInputChange}
            />
            <Textarea
              name="message"
              placeholder="Why are you interested?"
              rows={3}
              required
              value={formData.message}
              onChange={handleInputChange}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </DialogFooter>
          </form>

          {/* Success/Error Messages */}
          {successMessage && <p className="text-green-600 mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniversityCard;