import React from 'react';

function AboutUs() {
  return (
    <div className="bg-rose-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About <span className="text-rose-600">Blooming Delights</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Bringing joy through flowers since 2015
          </p>
        </div>

        {/* Our Story Section - Redesigned without image */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="p-8 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-rose-100 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-100 rounded-tr-full opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
              <div className="max-w-3xl mx-auto prose text-gray-500 text-center">
                <p className="text-lg">
                  Blooming Delights began as a small family-owned flower stall in the local market. Founded by Artina Lushaku and Rina Ademaj, our passion for flowers blossomed into the vibrant shop you see today.
                </p>
                <p className="mt-4 text-lg">
                  What started as a weekend hobby has grown into a beloved establishment in our community. Our mission is simple: to spread joy and create memorable moments through the beauty of nature.
                </p>
                <p className="mt-4 text-lg">
                  Each arrangement is crafted with love and attention to detail, ensuring that every bouquet tells a unique story. We take pride in sourcing the freshest flowers and creating designs that capture the essence of every occasion.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <div className="w-24 h-1 bg-rose-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Florists</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="h-60 bg-rose-200">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956" 
                alt="Emma Thompson" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Emma Thompson</h3>
              <p className="text-rose-600">Founder & Head Florist</p>
              <p className="mt-3 text-gray-500">
                With over 15 years of experience, Emma brings creativity and elegance to every arrangement.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="h-60 bg-rose-200">
              <img 
                src="https://images.unsplash.com/photo-1566492031773-4f4e44671857" 
                alt="Jacob Thompson" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Jacob Thompson</h3>
              <p className="text-rose-600">Co-Founder & Botanist</p>
              <p className="mt-3 text-gray-500">
                Jacob's knowledge of plants ensures we source only the freshest and most vibrant flowers.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="h-60 bg-rose-200">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" 
                alt="Lily Chen" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Lily Chen</h3>
              <p className="text-rose-600">Wedding Specialist</p>
              <p className="mt-3 text-gray-500">
                Lily specializes in creating magical wedding arrangements that make your special day unforgettable.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Blooming Delights?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Freshness Guarantee</h3>
              <p className="mt-2 text-gray-500">
                We source our flowers daily to ensure maximum freshness and longevity.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Creative Designs</h3>
              <p className="mt-2 text-gray-500">
                Our talented florists create unique arrangements for every occasion.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Customer Satisfaction</h3>
              <p className="mt-2 text-gray-500">
                Your happiness is our priority. We're not satisfied until you are.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Us Section - Redesigned without image */}
        <div className="bg-white rounded-lg shadow-lg mb-12">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Visit Our Shop</h2>
            <div className="bg-rose-50 rounded-lg p-6 border-2 border-rose-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">Location</h3>
                  <p className="text-gray-500 mt-2">123 Blossom Street</p>
                  <p className="text-gray-500">Flowertown, FT 12345</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">Hours</h3>
                  <p className="text-gray-500 mt-2">Monday - Friday: 9am - 6pm</p>
                  <p className="text-gray-500">Saturday: 10am - 4pm</p>
                  <p className="text-gray-500">Sunday: Closed</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 text-lg">Contact</h3>
                  <p className="text-gray-500 mt-2">Phone: (555) 123-4567</p>
                  <p className="text-gray-500">Email: hello@bloomingdelights.com</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg text-gray-600">
                We'd love to meet you in person! Come visit our shop and experience the magic of fresh flowers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs; 