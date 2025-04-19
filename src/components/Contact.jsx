import React, { useState, useEffect, useRef } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: '',
    isLoading: false
  });
  
  // Use a ref to track if the component is mounted
  const isMounted = useRef(true);
  
  // Set isMounted to false when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state
    setSubmitStatus({
      ...submitStatus,
      isLoading: true
    });
    
    try {
      // Send data to backend API
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        if (response.ok) {
          // Success
          setSubmitStatus({
            submitted: true,
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            isLoading: false
          });
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
        } else {
          // Error
          setSubmitStatus({
            submitted: true,
            success: false,
            message: data.message || 'Something went wrong. Please try again.',
            isLoading: false
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setSubmitStatus({
          submitted: true,
          success: false,
          message: 'Network error. Please check your connection and try again.',
          isLoading: false
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 to-rose-100 min-h-screen py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-rose-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-10 w-24 h-24 bg-rose-300 rounded-full opacity-10"></div>
      <div className="absolute bottom-1/3 left-10 w-32 h-32 bg-rose-300 rounded-full opacity-10"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl relative inline-block">
            Contact <span className="text-rose-600">Us</span>
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            We'd love to hear from you! Reach out with any questions or to place a special order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm bg-opacity-90 border border-rose-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-500 text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887.74 3.575 1.994 4.85l.007.006.003.004c1.01 1.023 2.244 1.924 3.096 2.743a3.21 3.21 0 001.8.897c.344.067.693.067 1.037 0a3.21 3.21 0 001.8-.897c.852-.819 2.087-1.72 3.096-2.743l.003-.004.007-.006A6.985 6.985 0 0016 8a6 6 0 00-6-6zm0 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </span>
                Get In Touch
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Our Address</h3>
                    <p className="mt-1 text-gray-600">123 Blossom Street, Flowertown, FT 12345</p>
                  </div>
                </div>

                <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <a href="tel:+15551234567" className="mt-1 text-gray-600 hover:text-rose-500 transition-colors">(555) 123-4567</a>
                  </div>
                </div>

                <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <a href="mailto:hello@bloomingdelights.com" className="mt-1 text-gray-600 hover:text-rose-500 transition-colors">hello@bloomingdelights.com</a>
                  </div>
                </div>

                <div className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <p className="mt-1 text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Our Blooms</h3>
                <div className="flex space-x-5">
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors duration-300 transform hover:scale-110">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors duration-300 transform hover:scale-110">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors duration-300 transform hover:scale-110">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-rose-500 transition-colors duration-300 transform hover:scale-110">
                    <span className="sr-only">Pinterest</span>
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl backdrop-blur-sm bg-opacity-90 border border-rose-100 relative overflow-hidden">
              {/* Decorative flower element */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-100 rounded-full opacity-40"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-100 rounded-full opacity-40"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-rose-500 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  Send Us a Message
                </h2>
                
                {submitStatus.submitted && (
                  <div className={`${submitStatus.success ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border-l-4 p-6 mb-8 rounded-r-lg animate-pulse`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {submitStatus.success ? (
                          <svg className="h-6 w-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-base font-medium ${submitStatus.success ? 'text-green-700' : 'text-red-700'}`}>{submitStatus.message}</p>
                        {submitStatus.success && (
                          <p className="text-sm text-green-600 mt-2">We appreciate you taking the time to reach out to us.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {(!submitStatus.submitted || !submitStatus.success) && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                      <div className="relative">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="peer w-full border-b-2 border-gray-300 py-2 focus:border-rose-500 focus:outline-none transition-colors bg-transparent rounded-none placeholder-transparent"
                          placeholder="Your Name"
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="peer w-full border-b-2 border-gray-300 py-2 focus:border-rose-500 focus:outline-none transition-colors bg-transparent rounded-none placeholder-transparent"
                          placeholder="Your Email"
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border-b-2 border-gray-300 py-2 focus:border-rose-500 focus:outline-none transition-colors bg-transparent rounded-none"
                          placeholder="Optional"
                        />
                      </div>
                      
                      <div className="relative">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="peer w-full border-b-2 border-gray-300 py-2 focus:border-rose-500 focus:outline-none transition-colors bg-transparent rounded-none placeholder-transparent"
                          placeholder="Message Subject"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 relative mt-4">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          required
                          value={formData.message}
                          onChange={handleChange}
                          className="peer w-full border-2 border-gray-300 p-3 rounded-lg focus:border-rose-500 focus:outline-none transition-colors placeholder-transparent"
                          placeholder="Your Message"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <button
                        type="submit"
                        disabled={submitStatus.isLoading}
                        className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-lg text-base font-medium rounded-lg text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span className="flex items-center">
                          {submitStatus.isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                              </svg>
                              Send Message
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* FAQ Section - Optional addition */}
            <div className="mt-10 bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm bg-opacity-90 border border-rose-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Do you deliver nationwide?</h4>
                  <p className="mt-2 text-gray-600">Yes, we offer nationwide delivery for all our flower arrangements and bouquets.</p>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">How far in advance should I place my wedding flower order?</h4>
                  <p className="mt-2 text-gray-600">We recommend booking your wedding flowers at least 3-6 months in advance to ensure availability.</p>
                </div>
                
                <div>
                  <h4 className="text-base font-medium text-gray-900">Do you offer same-day delivery?</h4>
                  <p className="mt-2 text-gray-600">Yes, we offer same-day delivery for orders placed before 1 PM local time, subject to availability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;