import { Scale, Landmark, Users, Gift } from "lucide-react";
import SimpleSlider from "./SimpleSlider";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import emailjs from "emailjs-com";

const HeroSection = () => {
  const stats = [
    {
      icon: <Landmark size={20} className="text-unicorn-primary" />,
      bgColor: "bg-unicorn-primary bg-opacity-10",
      text: "Explore Universities",
      link: "/universities",
    },
    {
      icon: <Users size={20} className="text-unicorn-secondary" />,
      bgColor: "bg-unicorn-secondary bg-opacity-10",
      text: "Connect with Students",
      link: "/student-connect",
    },
    {
      icon: <Gift size={20} className="text-unicorn-accent" />,
      bgColor: "bg-unicorn-accent bg-opacity-10",
      text: "Explore Scholarships",
      link: "/scholarships",
    },
    {
      icon: <Scale size={20} className="text-gray-600" />,
      bgColor: "bg-gray-100",
      text: "Compare Universities",
      link: "/compare",
    },
  ];

  // Modal-related states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      reason: formData.reason,
      city: formData.city,
    };

    try {
      await emailjs.send(
        "service_y45q18l", // Replace with your EmailJS Service ID
        "template_0sca4wc", // Replace with your EmailJS Template ID
        templateParams,
        "Oq-z6yc9UQ9hCrSZE" // Replace with your EmailJS User ID
      );

      setSuccessMessage(
        "Your inquiry is received. Expect a response within 24 hours!"
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        reason: "",
        city: "",
      });
      setTimeout(() => setIsModalOpen(false), 2000); // Close modal after 2 seconds
    } catch (error) {
      setErrorMessage(
        "There was an error submitting your request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="hero-section pt-20 px-2 pb-4 md:pb-4">
      <div className="hero-pattern"></div>
      <div className="container-custom relative z-10 flex justify-center">
        <div className="grid grid-cols-1 gap-12 items-center w-full max-w-4xl">
          <div className="space-y-6 text-center">
            <h1 className="text-blue-500 text-[22px] md:text-[28px] lg:text-[34px] xl:text-[34px] font-roboto font-semibold tracking-wide">
              Find Your Perfect University
            </h1>

            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <SimpleSlider />
              </div>
            </div>

            <div className="pt-6 fade-in-up-delay-3 px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
                {stats.map((stat, index) => (
                  <a
                    key={index}
                    href={stat.link}
                    className="relative text-center px-4 py-5 rounded-xl bg-white shadow-md transition-all duration-300   
                    hover:bg-blue-100 focus:outline-none block group border border-blue-400 w-full max-w-[180px]"
                  >
                    <span className="absolute top-2 right-4 text-blue-500 font-bold text-lg transition-transform duration-300">
                      →
                    </span>
                    <div
                      className={`w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center ${stat.bgColor}`}
                    >
                      {stat.icon}
                    </div>
                    <p className="text-sm font-normal text-gray-700">
                      {stat.text}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-white py-2 px-4 rounded-sm font-light text-lg shadow-lg 
                hover:bg-gray-900 transition-all duration-300 w-full max-w-md"
              >
                Free Expert Career Advice &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Career Advice Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle>Request Free Expert Career Advice</DialogTitle>
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
            <Input
              name="city"
              placeholder="Your City"
              required
              value={formData.city}
              onChange={handleInputChange}
            />
            <Textarea
              name="reason"
              placeholder="Why do you want career advice?"
              rows={3}
              required
              value={formData.reason}
              onChange={handleInputChange}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
          {successMessage && (
            <p className="text-green-600 mt-4">{successMessage}</p>
          )}
          {errorMessage && <p className="text-red-600 mt-4">{errorMessage}</p>}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HeroSection;
