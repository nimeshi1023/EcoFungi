import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import Logo from "../../assets/logo.png";

const EchoFungiHomepage = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  // Array of background images
  const bgImages = [
    "hero_section.jpg",
    "hero_section2.jpg",
    "hero_section3.jpg"
  ];

  // Animate content when component mounts
  useEffect(() => {
    setIsAnimated(true);
  }, []);

  // Cycle through background images
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 2000); // change every 2 seconds

    return () => clearInterval(interval);
  }, [bgImages.length]);

  // Hook to handle scroll animations
  const useScrollAnimation = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setVisible(entry.isIntersecting),
        { threshold: 0.2 }
      );
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, []);

    return [ref, visible];
  };

  // Sections refs
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [impactRef, impactVisible] = useScrollAnimation();

  return (
    <div className="bg-white overflow-x-hidden min-h-screen">

      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-2 border-green-200 fixed top-0 left-0 right-0 z-50 h-[80px]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
    <div className="flex justify-between items-center h-full">
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-2">
          {/* Logo adjusted to 80px */}
          <img src={Logo} alt="Logo" className="h-20 w-20 object-contain" />
          <span className="text-xl font-bold text-green-900">
            EchoFungi Mushroom Cultivation Management
          </span>
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        {['Home', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href={item === 'Home' ? '/' : item === 'About' ? '/about' : item === 'Contact' ? '/contact' : '#'}
            className="text-green-800 hover:text-green-500 transition-colors duration-300 font-medium"
          >
            {item}
          </a>
        ))}
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  </div>
</nav>


      {/* Hero Section */}
      <div
        className={`relative min-h-screen flex items-center pt-20 transition-all duration-1000 transform ${
          isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          backgroundImage: `url('${bgImages[bgIndex]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/50 transition-opacity duration-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8 text-white">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-700/80 rounded-full text-sm font-medium shadow-lg">
                🌱 Smart Mushroom Cultivation
              </div>

              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
                Grow Smarter,
                <span className="block text-green-400">Earn Better</span>
              </h1>

              <p className="text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-md">
                EchoFungi is a smart web-based platform designed to simplify and modernize mushroom farming.
                 Our system integrates IoT sensors, automation, and data analytics to help farmers monitor 
                 and control environmental conditions such as temperature, humidity, and light in real time. 
                 It also manages cultivation batches, inventory, sales, finances, 
                 and shop distributions — all from one dashboard. With features like automated spray scheduling,
                 real-time alerts, and detailed reporting, EchoFungi improves productivity, reduces waste, 
                 and supports data-driven decision-making for sustainable mushroom cultivation
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
               onClick={() => navigate('/login')}
              className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started
              </button>
             
            </div>
          </div>
        </div>
      </div>

      
      {/* Features Section */}
      <div
          ref={featuresRef}
          className={`bg-gray-50 py-20 transition-all duration-1000 transform ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-center text-green-800 mb-12">
              Why Choose EchoFungi?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {icon: '🍄',title: 'Batch Tracking', desc: 'Track each mushroom batch from spawning to harvesting with daily updates.' },
                { icon: '📅',title: 'Schedule Management',desc: 'Plan watering, spraying, and harvesting schedules for each batch.' },
                { icon: '📦', title: 'Packet Tracking', desc: 'Easily record daily mushroom packet output with just a few clicks.' },
                { icon: '🌡️', title: 'Climate Control', desc: 'Monitor live temperature & humidity for ideal growing conditions.' },
                  {icon: '🧾', title: 'Salary Report',desc: 'Manage staff salary records, calculate payments, and generate detailed reports.'},
                { icon: '📊',title: 'Inventory Management',desc: 'Monitor stock levels of mushroom packets and supplies in real-time.'},
                { icon: '💰', title: 'Finance Reports', desc: 'Track your farm’s expenses vs earnings with automated reports.' },
                { icon: '💵', title: 'Sales Tracking',desc: 'Track mushroom packet sales, shop distributions, and payment balances easily.'},
                 { icon: '📦',title: 'Stock Tracking',desc: 'Monitor stock levels of mushroom packets and raw materials in real-time.' },

              ].map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-md p-8 text-center transition-all transform ${
                    featuresVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }} // staggered delay
                >
                  <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-3xl mb-6 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>



         
      {/* How It Works Section */}
<section className="my-12 max-w-7xl mx-auto px-6 lg:px-8">
  <div className="flex flex-col md:flex-row items-center gap-8">
    {/* Text Left */}
    <div className="md:w-1/2 text-left">
      <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
        How EchoFungi Works
      </h2>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        Learn how our Mushroom Cultivation Management system helps you Control Environment.
      </p>
    </div>

    {/* Video Right */}
    <div className="md:w-1/2">
      <video
        src="/videos/intro.mp4"
        autoPlay
        loop
        muted
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>
  </div>
</section>







      {/* About Section */}
      <div
        ref={aboutRef}
        className={`bg-gradient-to-br from-green-50 via-white to-green-50 py-20 transition-all duration-1000 transform ${
          aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative flex justify-center">
            <div className="w-96 h-96 rounded-full overflow-hidden shadow-2xl border-4 border-green-200">
              <img
                src="mush2.jpg"
                alt="About EchoFungi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-6 right-10 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-semibold">
              🍄 Sri Lankan Innovation
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-green-900 leading-tight">
              About <span className="text-green-600">EchoFungi</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At <span className="font-semibold text-green-700">EchoFungi</span>, 
              we’re on a mission to revolutionize Sri Lankan mushroom farming. 
              By blending <span className="text-green-600 font-medium">modern technology</span> 
              with traditional expertise, we empower farmers to boost productivity, 
              ensure quality, and expand into new markets.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From packet tracking to smart climate monitoring and automated financial 
              insights, EchoFungi is more than a platform — it’s a trusted partner for 
              farmers who want to grow sustainably and profitably.
            </p>
            <button className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-all shadow-md">
              Learn More →
            </button>
          </div>
        </div>
      </div>

     

      {/* Footer */}
   <footer className="bg-green-900 text-gray-100">
  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* Logo + About */}
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="Logo" className="h-20 w-20 object-contain" />
        <span className="text-base font-bold text-white leading-tight">
          EchoFungi <br /> 
          <span className="text-sm font-medium text-gray-200">
            Mushroom Cultivation Management
          </span>
        </span>
      </div>
      <p className="text-gray-300 text-xs leading-relaxed">
        Empowering Sri Lankan mushroom farmers with smart technology to boost productivity, ensure quality, and grow profitably.
      </p>
    </div>

    {/* Quick Links */}
    <div className="space-y-2">
      <h4 className="text-base font-semibold text-white">Quick Links</h4>
      <ul className="space-y-1 text-gray-300 text-sm">
        {['Home', 'Packets', 'About', 'Contact'].map((link) => (
          <li key={link}>
            <a href="#" className="hover:text-green-400 transition-colors duration-300">{link}</a>
          </li>
        ))}
      </ul>
    </div>

    {/* Resources */}
    <div className="space-y-2">
      <h4 className="text-base font-semibold text-white">Resources</h4>
      <ul className="space-y-1 text-gray-300 text-sm">
        <li><a href="#" className="hover:text-green-400 transition-colors duration-300">FAQs</a></li>
        <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Support</a></li>
        <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Blog</a></li>
      </ul>
    </div>

    {/* Contact */}
    <div className="space-y-2">
      <h4 className="text-base font-semibold text-white">Contact Us</h4>
      <p className="text-gray-300 text-sm">📍 Galle, Sri Lanka</p>
      <p className="text-gray-300 text-sm">📧 ecoFungi@gmail.com</p>
      <p className="text-gray-300 text-sm">📞 +94 77 974 5000</p>
      <div className="flex space-x-3 mt-1">
        <a href="#" className="text-gray-300 hover:text-blue-500 transition-colors duration-300 text-xl" aria-label="Twitter">🐦</a>
        <a href="#" className="text-gray-300 hover:text-blue-700 transition-colors duration-300 text-xl" aria-label="Facebook">📘</a>
        <a href="#" className="text-gray-300 hover:text-pink-500 transition-colors duration-300 text-xl" aria-label="Instagram">📸</a>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="mt-6 border-t border-green-800 pt-3 text-center text-gray-400 text-xs">
    &copy; {new Date().getFullYear()} EchoFungi. All rights reserved.
  </div>
</footer>


    </div>
  );
};

export default EchoFungiHomepage;
