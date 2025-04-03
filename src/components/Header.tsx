import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  
  const location = useLocation();
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://unicorner-back.vercel.app/notification');
        const newNotifications = response.data.data;
        setNotifications(newNotifications);

        const prevNotificationCount = parseInt(localStorage.getItem('notificationCount') || '0', 10);
        const currentNotificationCount = newNotifications.length;

        const hasViewed = localStorage.getItem('hasViewedNotifications');
        if (currentNotificationCount > prevNotificationCount) {
          localStorage.setItem('hasViewedNotifications', 'false');
          localStorage.setItem('notificationCount', currentNotificationCount.toString());
          setHasUnreadNotifications(true);
        } else {
          setHasUnreadNotifications(!hasViewed && currentNotificationCount > 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      localStorage.setItem('hasViewedNotifications', 'true');
      setHasUnreadNotifications(false);
    }
  };

  const handleNotificationClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    }
  };

  const handleNavClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Universities', path: '/universities' },
    { name: 'Scholarships', path: '/scholarships' },
    { name: 'Student Connect', path: '/student-connect' },
    { name: 'Compare', path: '/compare' },
    { name: 'About', path: '/about' },
  ];

  const scrollToTop = () => {  
    window.scrollTo({ top: 0, behavior: 'smooth' });  
  };  

  return (
    <header className={`navbar fixed w-full ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container-custom mx-auto py-3 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="md:hidden p-2 text-gray-700 hover:text-blue-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 ml-2">  
            <img 
              src="/logo.png" // Use absolute path from public folder
              alt="ScholarEU Logo" 
              className="w-8 h-8 rounded-md object-cover" // Added object-cover for safety
              onError={(e) => { (e.target as HTMLImageElement).src = '/fallback-logo.png'; }} // Fallback image
            />
            <span className="text-xl font-bold text-blue-500">ScholarEU</span>
          </Link>  
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'text-unicorn-primary after:w-full' : ''}`}
              onClick={handleNavClick}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4 relative">
          <div className="relative" ref={notificationRef}>
            <button 
              className="p-2 text-gray-700 hover:text-blue-500 relative" 
              onClick={toggleNotification}
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
              )}
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 border border-gray-200">
                <div className="px-4 py-2 font-semibold border-b">Notifications</div>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      className={`px-4 py-2 text-gray-700 hover:bg-gray-100 ${notif.link ? 'cursor-pointer' : ''}`}
                      onClick={() => handleNotificationClick(notif.link)}
                    >
                      <div className="font-semibold">{notif.title}</div>
                      <div className="text-sm">{notif.message}</div>
                      {notif.link && (
                        <span className="text-xs text-blue-500">Click to open</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">No notifications</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (  
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in w-full">  
          <div className="px-4 py-4">  
            <nav className="flex flex-col space-y-3">  
              {navLinks.map((link) => (  
                <Link  
                  key={link.name}  
                  to={link.path}  
                  className={`flex items-center justify-between px-4 py-2 rounded-lg transition duration-200 ${  
                    location.pathname === link.path   
                      ? 'bg-blue-100 text-blue-600 font-semibold'   
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'  
                  }`}  
                  onClick={() => { setIsMobileMenuOpen(false); handleNavClick(); }}  
                >  
                  <span>{link.name}</span>  
                  <ChevronRight size={16} className="text-gray-400 transition-transform duration-200 transform hover:translate-x-1" />  
                </Link>  
              ))}  
            </nav>  
          </div>  
        </div>  
      )}  
    </header>
  );
};

export default Header;