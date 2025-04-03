import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './SimpleSlider.css';
import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Configure Sanity client
const client = sanityClient({
  projectId: 'ssp5a649', // Your Sanity project ID
  dataset: 'production', // Your dataset name
  useCdn: true,
  apiVersion: '2021-03-25',
});

// Image URL builder
const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source);
}

const SimpleSlider = () => {
  const sliderRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  // Fetch slides from Sanity
  useEffect(() => {
    const query = `*[_type == "sliderImage"] | order(order asc) {
      "imageUrl": image.asset->url,
      image {
        asset,
        alt
      },
      link
    }`;

    client
      .fetch(query)
      .then((data) => {
        setSlides(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching slides:', error);
        setLoading(false);
      });
  }, []);

  // Handle slide click to open link
  const handleSlideClick = (link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return <div>Loading slides...</div>;
  }

  return (
    <div className="relative w-full">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className="aspect-ratio-container"
            onClick={() => handleSlideClick(slide.link)}
            style={{ cursor: slide.link ? 'pointer' : 'default' }} // Change cursor if clickable
          >
            <img
              src={urlFor(slide.image).width(1200).url()}
              alt={slide.image.alt || `Slide ${index + 1}`}
              className="image"
            />
          </div>
        ))}
      </Slider>

      {/* Left Arrow */}
      <button
        className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition"
        onClick={() => sliderRef.current.slickPrev()}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-600 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition"
        onClick={() => sliderRef.current.slickNext()}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default SimpleSlider;