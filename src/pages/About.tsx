import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Mail, Phone, CheckCircle, Users, GraduationCap, Building, Award } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import emailjs from 'emailjs-com';

const About = () => {
  // Form states for Get In Touch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    };

    try {
      await emailjs.send(
        'service_wb00ivb', // Replace with your EmailJS service ID
        'template_o7v1ka8', // Replace with your EmailJS template ID (e.g., get_in_touch)
        templateParams,
        '0YDfUik5ymZEa3qTM' // Replace with your EmailJS user ID
      );

      setSuccessMessage('Your message has been sent successfully! We’ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    } catch (error) {
      setErrorMessage('Failed to send your message. Please try again later.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <main className="pt-14">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-unicorn-primary/10 to-unicorn-secondary/10 py-8">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-2xl font-bold mb-1">About Us</h1>
              <p className="text-sm text-gray-600 mt-0">
                Connecting students to their ideal universities through authentic insights and direct connections.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-6">
          <div className="container-custom text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-6">
                  At ScholarEU, we believe that choosing the right university is one of the most important decisions in a student's life. Our mission is to simplify this process for students by providing a comprehensive platform that connects them directly with universities and current students.
                </p>
                <p className="text-gray-700">
                  We are committed to offering transparent, authentic information that helps students make informed decisions about their higher education journey. Through our platform, we aim to bridge the gap between students and universities, making the admission process smoother and more accessible.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600&h=400" 
                  alt="Students discussing at a university" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-6 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-soft border border-blue-400">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="text-unicorn-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  We provide genuine, unbiased information about universities to help students make informed decisions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft border border-blue-400">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary/10 flex items-center justify-center mb-4">
                  <Users className="text-unicorn-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-gray-600">
                  We foster a supportive community where students can connect, share experiences, and help each other.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft border border-blue-400">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="text-unicorn-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in all our services, continually improving to meet student needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft border border-blue-400">
                <div className="w-12 h-12 rounded-full bg-unicorn-primary/10 flex items-center justify-center mb-4">
                  <Building className="text-unicorn-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Inclusivity</h3>
                <p className="text-gray-600">
                  We embrace diversity and ensure our platform is accessible to all students.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-6 text-center">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Our Story</h2>
              <p className="text-gray-700 mb-6">
                ScholarEU was founded in 2023 by a group of alumni who experienced firsthand the challenges of navigating the university admission process. Recognizing the need for a centralized platform that provides authentic information and direct connections, they created ScholarEU to help future generations of students.
              </p>
              <p className="text-gray-700 mb-6">
                What started as a small initiative has now grown into a comprehensive platform connecting thousands of students with universities across Europe. Our team has expanded to include education experts and current university students who work together to provide the best possible resources and support.
              </p>
              <p className="text-gray-700">
                Today, ScholarEU continues to evolve with the changing needs of students and universities, remaining committed to our mission of simplifying the university selection and application process for students worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section className="py-6 bg-gradient-to-r from-unicorn-primary/10 to-unicorn-secondary/10">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6 text-center">Get In Touch</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-700 mb-6">
                Have questions or need assistance? Contact us directly - we’re here to help you on your university journey!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center">
                  <Mail className="text-unicorn-primary mr-2" size={20} />
                  <span className="text-gray-700">scholareustudent@gmail.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="text-unicorn-primary mr-2" size={20} />
                  <span className="text-gray-700">+977 9744202066</span>
                </div>
                <div className="flex items-center justify-center">
                  <MapPin className="text-unicorn-primary mr-2" size={20} />
                  <span className="text-gray-700">Kathmandu, Nepal</span>
                </div>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-unicorn-primary text-white px-6 py-3 rounded-lg hover:bg-unicorn-primary/90 transition-colors"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Contact Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby="dialog-description">
          <DialogTitle>Get In Touch</DialogTitle>
          <p id="dialog-description" className="text-gray-600 text-sm mb-4">
            Fill out the form below to send us a message. We’ll respond within 24 hours.
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
                {isSubmitting ? 'Sending...' : 'Send Message'}
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

export default About;