import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../../assets/logo.png";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-white overflow-x-hidden min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b-2 border-green-200 fixed top-0 left-0 right-0 z-50 h-[80px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center space-x-3">
              <div className="flex items-center gap-2">
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
                  className={`${
                    item === 'Contact' 
                      ? 'text-green-500 font-semibold' 
                      : 'text-green-800 hover:text-green-500'
                  } transition-colors duration-300 font-medium`}
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
      <div className="bg-gradient-to-br from-green-50 via-white to-green-50 py-16 pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-900 mb-6">
            Contact <span className="text-green-600">EchoFungi</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get in touch with us! We're here to help you with your mushroom cultivation journey. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-green-900 mb-6">Get in Touch</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We're always excited to hear from mushroom farmers and enthusiasts. 
                  Whether you have questions about our platform, need technical support, 
                  or want to share your success stories, we'd love to connect with you.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">Address</h3>
                    <p className="text-gray-700">Galle, Sri Lanka</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">Email</h3>
                    <p className="text-gray-700">ecoFungi@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-1">Phone</h3>
                    <p className="text-gray-700">+94 77 974 5000</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 text-xl"
                    aria-label="Twitter"
                  >
                    🐦
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors duration-300 text-xl"
                    aria-label="Facebook"
                  >
                    📘
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors duration-300 text-xl"
                    aria-label="Instagram"
                  >
                    📸
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-green-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                question: "How do I get started with EchoFungi?",
                answer: "Simply register for an account, complete your profile setup, and you'll have access to all our mushroom cultivation management features."
              },
              {
                question: "Is EchoFungi suitable for small-scale farmers?",
                answer: "Yes! EchoFungi is designed to scale with your operation, whether you're a small-scale farmer or managing a large commercial facility."
              },
              {
                question: "What kind of support do you provide?",
                answer: "We offer comprehensive support including technical assistance, training materials, and direct contact with our support team via email and phone."
              },
              {
                question: "Can I track multiple mushroom batches simultaneously?",
                answer: "Absolutely! Our platform allows you to manage and track multiple batches at different growth stages simultaneously."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-green-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
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
              {['Home', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={link === 'Home' ? '/' : link === 'About' ? '/about' : link === 'Contact' ? '/contact' : '#'} 
                    className="hover:text-green-400 transition-colors duration-300"
                  >
                    {link}
                  </a>
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

export default Contact;

