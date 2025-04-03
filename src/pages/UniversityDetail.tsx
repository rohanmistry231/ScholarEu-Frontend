import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { University, Review, StudentAmbassador } from "@/lib/types";
import {
  MapPin,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Award,
  DollarSign,
  Star,
  Building,
  ThumbsUp,
  ExternalLink,
  Mail,
  Globe,
  Share2,
  PlusCircle,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import emailjs from 'emailjs-com';

const UniversityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [ambassadors, setAmbassadors] = useState<StudentAmbassador[]>([]);
  const [universityReviews, setUniversityReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    universityLocation: "", // Prepopulated field
    program: "", // Program selection
    city: "", // New field for applicant's city
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUniversityData = async () => {

      if (!id || id === "undefined") {
        setError("Invalid or missing university ID in URL");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const uniResponse = await fetch(
          `https://unicorner-back.vercel.app/universities/${id}`
        );
        if (!uniResponse.ok) {
          const errorData = await uniResponse.json();
          throw new Error(errorData.message || "Failed to fetch university");
        }
        const uniResult = await uniResponse.json();
        if (!uniResult.success)
          throw new Error(uniResult.message || "University not found");

        console.log("UniversityDetail - Fetched university:", uniResult.data);
        setUniversity(uniResult.data);

        // Prepopulate universityLocation in formData
        setFormData((prev) => ({
          ...prev,
          universityLocation: `${uniResult.data.location}, ${uniResult.data.country}`,
        }));

        try {
          const reviewsResponse = await fetch(
            `https://unicorner-back.vercel.app/reviews/university/${id}`
          );
          if (!reviewsResponse.ok) {
            console.warn("No reviews found for university:", id);
            setUniversityReviews([]);
          } else {
            const reviewsResult = await reviewsResponse.json();
            setUniversityReviews(reviewsResult.data || []);
          }
        } catch (err) {
          console.warn("Reviews fetch failed, continuing without reviews:", err);
          setUniversityReviews([]);
        }

        try {
          const ambassadorsResponse = await fetch(
            `https://unicorner-back.vercel.app/students/university/${id}`
          );
          if (!ambassadorsResponse.ok) {
            console.warn("No ambassadors found for university:", id);
            setAmbassadors([]);
          } else {
            const ambassadorsResult = await ambassadorsResponse.json();
            setAmbassadors(ambassadorsResult.data || []);
          }
        } catch (err) {
          console.warn("Ambassadors fetch failed, continuing without ambassadors:", err);
          setAmbassadors([]);
        }
      } catch (err) {
        console.error("UniversityDetail - Critical fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUniversity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversityData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container-custom pt-32 pb-16 text-center">
          <div className="loader"></div>
          <p className="mt-4 text-gray-600">Loading university details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !university) {
    return (
      <>
        <Header />
        <div className="container-custom pt-32 pb-16 text-center">
          <p className="text-red-600">{error || "University not found"}</p>
        </div>
        <Footer />
      </>
    );
  }

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={`${
              star <= Math.floor(rating)
                ? "text-yellow-500 fill-yellow-500"
                : star <= rating
                ? "text-yellow-500 fill-yellow-500 opacity-50"
                : "text-gray-300"
            } mr-1`}
          />
        ))}
      </div>
    );
  };

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
    setSuccessMessage("");
    setErrorMessage("");

    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      universityName: university.name,
      universityLocation: formData.universityLocation,
      program: formData.program,
      city: formData.city, // New field added to template params
    };

    try {
      await emailjs.send(
        "service_y45q18l", // Replace with your EmailJS service ID
        "template_0sca4wc", // Replace with your EmailJS template ID
        templateParams,
        "Oq-z6yc9UQ9hCrSZE" // Replace with your EmailJS user ID
      );

      setSuccessMessage("Your inquiry is received. Expect a response within 24 hours!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        universityLocation: `${university.location}, ${university.country}`,
        program: "",
        city: "", // Reset city field
      });
    } catch (error) {
      setErrorMessage(
        "There was an error submitting your application. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 pb-0">
        <section className="bg-white border-b border-gray-100">
          <div className="container-custom py-6 sm:py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white shadow-soft border border-gray-100 flex-shrink-0">
                <img
                  src={university.logo}
                  alt={university.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                      {university.name}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start text-gray-600 mb-1 sm:mb-2">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm sm:text-base">
                        {university.location}, {university.country}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="btn-primary w-full sm:w-auto text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        <section className="bg-white sticky top-16 z-10 border-b border-gray-100 shadow-sm">
          <div className="container-custom">
            <div className="flex overflow-x-auto hide-scrollbar">
              <button
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "overview"
                    ? "border-unicorn-primary text-unicorn-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "programs"
                    ? "border-unicorn-primary text-unicorn-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("programs")}
              >
                Programs
              </button>
              <button
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "admission"
                    ? "border-unicorn-primary text-unicorn-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("admission")}
              >
                Admission
              </button>
              <button
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "reviews"
                    ? "border-unicorn-primary text-unicorn-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
              <button
                className={`px-5 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "connect"
                    ? "border-unicorn-primary text-unicorn-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab("connect")}
              >
                Student Connect
              </button>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4">
                        About {university.name}
                      </h2>
                      <p className="text-gray-700 mb-6">
                        {university.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-3">
                            Campus Life
                          </h3>
                          <p className="text-gray-700">
                            {university.campusLife}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold mb-3">
                            Key Facts
                          </h3>
                          <ul className="space-y-3">
                            <li className="flex items-center">
                              <Calendar
                                size={18}
                                className="text-unicorn-primary mr-3"
                              />
                              <div>
                                <span className="text-gray-600 text-sm">
                                  Established
                                </span>
                                <p className="font-medium">
                                  {university.establishedYear}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-center">
                              <Users
                                size={18}
                                className="text-unicorn-primary mr-3"
                              />
                              <div>
                                <span className="text-gray-600 text-sm">
                                  Student Population
                                </span>
                                <p className="font-medium">
                                  {university.studentCount.toLocaleString()}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-center">
                              <Award
                                size={18}
                                className="text-unicorn-primary mr-3"
                              />
                              <div>
                                <span className="text-gray-600 text-sm">
                                  Accreditation
                                </span>
                                <p className="font-medium">
                                  {university.accreditation}
                                </p>
                              </div>
                            </li>
                            <li className="flex items-center">
                              <Globe
                                size={18}
                                className="text-unicorn-primary mr-3"
                              />
                              <div>
                                <span className="text-gray-600 text-sm">
                                  Website
                                </span>
                                <a
                                  href={university.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-unicorn-primary hover:underline"
                                >
                                  Visit Website
                                </a>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4">Facilities</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {university.facilities.map((facility, index) => (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 rounded-lg border"
                          >
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "programs" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4">
                        Programs Offered
                      </h2>
                      <p className="text-gray-700 mb-6">
                        {university.name} offers a wide range of undergraduate
                        and postgraduate programs across various disciplines.
                      </p>
                      <div className="space-y-6">
                        {university.programs.map((program, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {program}
                                </h3>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "admission" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4">
                        Admission Requirements
                      </h2>
                      <p className="text-gray-700 mb-6">
                        Here are the general admission requirements for{" "}
                        {university.name}. Requirements may vary by program.
                      </p>
                      <ul className="space-y-3 mb-6">
                        {university.admissionRequirements.map(
                          (requirement, index) => (
                            <li key={index} className="flex items-start">
                              <div className="mt-1 mr-3 text-unicorn-primary">
                                •
                              </div>
                              <span>{requirement}</span>
                            </li>
                          )
                        )}
                      </ul>
                      <div className="divider"></div>
                      <h3 className="text-xl font-semibold mb-4">
                        Application Process
                      </h3>
                      <div className="space-y-4">
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-unicorn-primary text-white flex items-center justify-center font-semibold mr-4">
                            1
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Complete Online Application
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Fill out the online application form with your
                              personal and academic details.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-unicorn-primary text-white flex items-center justify-center font-semibold mr-4">
                            2
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Submit Required Documents
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Upload academic transcripts, English proficiency
                              test scores, and other required documents.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-unicorn-primary text-white flex items-center justify-center font-semibold mr-4">
                            3
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Pay Application Fee
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Pay the non-refundable application fee to process
                              your application.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-unicorn-primary text-white flex items-center justify-center font-semibold mr-4">
                            4
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Entrance Examination/Interview
                            </h4>
                            <p className="text-gray-600 text-sm">
                              Some programs may require entrance examinations or
                              interviews.
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="w-8 h-8 rounded-full bg-unicorn-primary text-white flex items-center justify-center font-semibold mr-4">
                            5
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">
                              Receive Acceptance Letter
                            </h4>
                            <p className="text-gray-600 text-sm">
                              If accepted, you will receive an acceptance letter
                              with further instructions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-4">
                        Scholarships & Financial Aid
                      </h2>
                      <p className="text-gray-700 mb-6">
                        {university.name} offers various scholarships and
                        financial aid options to support students in their
                        academic journey.
                      </p>
                      <div className="space-y-4">
                        {university.scholarships.map((scholarship, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-start">
                              <Award
                                size={20}
                                className="text-unicorn-accent mt-1 mr-3"
                              />
                              <div>
                                <h4 className="font-medium">{scholarship}</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Eligibility and application details available
                                  on the university website.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                          Student Reviews
                        </h2>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">
                            ({universityReviews.length} reviews)
                          </span>
                        </div>
                      </div>

                      {universityReviews.length > 0 ? (
                        <div className="space-y-6">
                          {universityReviews.map((review, index) => (
                            <div
                              key={review.id || index}
                              className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start">
                                  <img
                                    src={review.profileImage}
                                    alt={review.studentName}
                                    className="w-14 h-14 rounded-full mr-4 border border-gray-300 shadow-sm"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-800">
                                      {review.studentName}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                      {review.program}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-3">
                                      {renderRatingStars(review.rating)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-4 text-gray-700 leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center py-8 bg-gray-100 rounded-lg">
                          <img
                            src="/images/no-reviews.svg"
                            alt="No reviews"
                            className="w-24 h-24 mb-4"
                          />
                          <p className="text-gray-600 text-lg">
                            No reviews available for this university yet.
                          </p>
                          <p className="text-gray-500 text-sm mt-1">
                            Be the first to share your experience!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "connect" && (
                  <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                      <h2 className="text-2xl font-bold mb-6">
                        Connect with Student Ambassadors
                      </h2>
                      {ambassadors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {ambassadors.map((ambassador) => (
                            <div
                              key={ambassador._id}
                              className="bg-gray-50 p-4 rounded-xl"
                            >
                              <div className="flex items-start">
                                <img
                                  src={ambassador.profileImage}
                                  alt={ambassador.name}
                                  className="w-14 h-14 rounded-full mr-4 object-cover"
                                />
                                <div>
                                  <h4 className="font-medium">
                                    {ambassador.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {ambassador.program}, Year {ambassador.year}
                                  </p>
                                  <a href="/student-connect" className="text-unicorn-primary text-sm font-medium mt-2 hover:underline">
                                    Connect
                                  </a>
                                </div>
                              </div>
                              <p className="mt-4 text-sm text-gray-700">
                                {ambassador.about}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <p className="text-gray-600">
                            No student ambassadors available for this university
                            yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 sticky top-40">
                  <h3 className="text-xl font-bold mb-4">Quick Info</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <DollarSign
                        size={18}
                        className="text-unicorn-primary mt-1 mr-3"
                      />
                      <div>
                        <span className="text-gray-600 text-sm">
                          Undergraduate Tuition
                        </span>
                        <p className="font-medium">
                          {university.tuitionFees.undergraduate || "N/A"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <DollarSign
                        size={18}
                        className="text-unicorn-primary mt-1 mr-3"
                      />
                      <div>
                        <span className="text-gray-600 text-sm">
                          Postgraduate Tuition
                        </span>
                        <p className="font-medium">
                          {university.tuitionFees.postgraduate || "N/A"}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <GraduationCap
                        size={18}
                        className="text-unicorn-primary mt-1 mr-3"
                      />
                      <div>
                        <span className="text-gray-600 text-sm">Programs</span>
                        <p className="font-medium">
                          {university.programs.length}+ Programs
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Award
                        size={18}
                        className="text-unicorn-primary mt-1 mr-3"
                      />
                      <div>
                        <span className="text-gray-600 text-sm">
                          Scholarships
                        </span>
                        <p className="font-medium">
                          {university.scholarships.length} Options
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Mail
                        size={18}
                        className="text-unicorn-primary mt-1 mr-3"
                      />
                      <div>
                        <span className="text-gray-600 text-sm">
                          Contact Email
                        </span>
                        <p className="font-medium">{university.contactEmail}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
                  <h3 className="text-xl font-bold mb-4">Compare</h3>
                  <p className="text-gray-600 mb-4">
                    Add this university to the comparison list to compare with
                    other universities.
                  </p>
                  <Link
                    to={`/compare?add=${university._id}`}
                    className="btn-secondary w-full"
                  >
                    Add to Compare
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default UniversityDetail;