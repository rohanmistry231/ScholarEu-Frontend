import React from 'react';  
import { Link } from 'react-router-dom';  
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';  

const Footer = () => {  
  // Function to scroll to the top
  const scrollToTop = () => {  
    window.scrollTo({ top: 0, behavior: 'smooth' });  
  };  

  return (  
    <footer className="bg-gray-50 pt-8 pb-4">  
      <div className="container-custom">  
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-center">  
          <Link 
            to="/" 
            className="flex items-center gap-2 ml-2"
            onClick={scrollToTop}
          >
            <img 
              src="/logo.png" // Changed to absolute path
              alt="ScholarEU Logo"
              className="w-8 h-8 rounded-md object-cover" // Added object-cover
              onError={(e) => { (e.target as HTMLImageElement).src = '/fallback-logo.png'; }} // Fallback image
            />
            <span className="text-xl font-bold text-blue-500">ScholarEU</span>
          </Link>
          <p className="text-gray-600 mt-3 md:mt-0">  
            Connecting Nepalese students to Indian universities.  
          </p>  
        </div>  

        <div className="flex justify-center space-x-4 mb-4">  
          <a href="https://www.facebook.com/share/18peWuDvUG/" className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-unicorn-primary transition-colors">  
            <Facebook size={16} />  
          </a>  
          <a href="https://x.com/ScholarEU?s=09" className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-unicorn-primary transition-colors">  
            <Twitter size={16} />  
          </a>  
          <a href="https://www.instagram.com/unicorner.official?igsh=MXdxOWxwZzZoZjlpdQ==" className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-unicorn-primary transition-colors">  
            <Instagram size={16} />  
          </a>  
          <a href="https://www.youtube.com/@unicornernp" className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-unicorn-primary transition-colors">  
            <Youtube size={16} />  
          </a>  
          <a href="https://www.linkedin.com/in/uni-corner-47204435a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-unicorn-primary transition-colors">  
            <Linkedin size={16} />  
          </a>  
        </div>  

        <div className="text-center mt-4">  
          <p className="text-gray-500 text-sm">  
            © {new Date().getFullYear()} ScholarEU. All rights reserved.  
          </p>  
          <div className="flex justify-center space-x-4 mt-2">  
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-unicorn-primary transition-colors">  
              Privacy Policy  
            </Link>  
            <Link to="/terms" className="text-gray-500 text-sm hover:text-unicorn-primary transition-colors">  
              Terms of Service  
            </Link>  
          </div>  
        </div>  
      </div>  
    </footer>  
  );  
};  

export default Footer;