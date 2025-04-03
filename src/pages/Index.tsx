import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { universities } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configure Sanity client
const client = sanityClient({
  projectId: 'ssp5a649', // Replace with your Sanity project ID
  dataset: 'production', // Replace with your dataset name
  useCdn: true,
  apiVersion: '2021-03-25',
});

// Image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const Index = () => {
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch success stories from Sanity
  useEffect(() => {
    const query = `*[_type == "successStories"] {
      name,
      smallDescription,
      review,
      image {
        asset,
        alt
      }
    }`;

    client
      .fetch(query)
      .then((data) => {
        setSuccessStories(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching success stories:', error);
        setLoading(false);
      });
  }, []);

  // Scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((reveal) => {
        const revealTop = reveal.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (revealTop < windowHeight - 100) {
          reveal.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const featuredUniversities = universities.filter((uni) => uni.featured);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />

        {/* Testimonials Section */}
        <section className="section bg-white py-6 px-2">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-6">
              <div className="inline-block px-4 py-2 bg-unicorn-primary bg-opacity-10 rounded-full text-unicorn-primary font-medium text-sm mb-2">
                Success Stories
              </div>
              <h2 className="text-2xl font-bold mt-2">What Our Students Say</h2>
            </div>

            {loading ? (
              <div>Loading testimonials...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {successStories.slice(0, 3).map((story, index) => (
                  <div
                    key={index}
                    className="px-5 py-5 rounded-xl reveal bg-gray-100 border border-blue-400"
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <img
                          src={urlFor(story.image).width(150).height(150).url()}
                          alt={story.image.alt || `${story.name} testimonial`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-gray-500">{story.smallDescription}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{story.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

 {/* Contact Us Section */}
<section className="section bg-gradient-to-br from-white to-blue-50 pt-4 pb-2">
  <div className="container-custom">
    <div className="text-center max-w-2xl mx-auto mb-6">
      <div className="inline-block px-3 py-1 bg-unicorn-primary bg-opacity-20 rounded-full text-unicorn-primary font-semibold text-xs mb-3 shadow-sm">
        Contact Us
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Connect with Our Experts</h2>
      <Card className="max-w-md mx-auto p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <ul className="space-y-3">
          {[
            {
              icon: <Phone size={18} className="text-blue-600" />,
              key: "New Student",
              value: "+977 9744202066",
            },
            {
              icon: <Phone size={18} className="text-blue-600" />,
              key: "Existing Student",
              value: "+977 9744202066",
            },
            {
              icon: <Mail size={18} className="text-blue-600" />,
              key: "Email",
              value: "scholareustudent@gmail.com",
            },
            {
              icon: <MapPin size={18} className="text-blue-600" />,
              key: "Visit Us",
              value: "10 AM to 5 PM",
            },
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-center text-center p-2 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <div>
                  <p className="font-semibold text-gray-700 text-sm">{item.key}</p>
                  <p className="text-base font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  </div>
</section>
      </main>
      <Footer />
    </>
  );
};

export default Index;