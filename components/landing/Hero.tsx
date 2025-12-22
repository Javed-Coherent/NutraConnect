import Link from 'next/link';
import { ArrowRight, Factory, Search } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm text-teal-700 mb-6">
            <span className="mr-2">AI-Powered</span>
            <span className="h-1 w-1 rounded-full bg-teal-400" />
            <span className="ml-2">50,000+ Verified Companies</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Find Your Next Business Partner in{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Nutraceuticals
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered intelligence platform connecting manufacturers, distributors, and retailers
            across India&apos;s health supplement industry.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* For Suppliers */}
            <Link href="/for-suppliers" className="group">
              <div className="h-full border-2 border-teal-300 bg-teal-50 hover:border-teal-500 hover:bg-teal-100/80 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/50 hover:-translate-y-2 hover:scale-[1.02] rounded-xl p-6 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-teal-300 transition-all duration-300">
                    <Factory className="h-7 w-7 text-teal-600 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                    I&apos;m Looking for CUSTOMERS
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 group-hover:text-teal-600 transition-colors">
                    (I&apos;m a Manufacturer / Supplier)
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4 text-left">
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Find distributors & retailers
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-75">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Expand your dealer network
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mr-2 group-hover:scale-150 transition-transform" />
                      Get leads for your products
                    </li>
                  </ul>
                  <div className="flex items-center text-teal-600 font-semibold group-hover:text-teal-700 bg-transparent group-hover:bg-teal-500 group-hover:text-white px-4 py-2 rounded-full transition-all duration-300">
                    Explore Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            {/* For Buyers */}
            <Link href="/for-buyers" className="group">
              <div className="h-full border-2 border-emerald-300 bg-emerald-50 hover:border-emerald-500 hover:bg-emerald-100/80 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/50 hover:-translate-y-2 hover:scale-[1.02] rounded-xl p-6 cursor-pointer">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-300 transition-all duration-300">
                    <Search className="h-7 w-7 text-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    I&apos;m Looking for SUPPLIERS
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 group-hover:text-emerald-600 transition-colors">
                    (I&apos;m a Buyer / Distributor)
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4 text-left">
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Find manufacturers & vendors
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-75">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Get verified supplier leads
                    </li>
                    <li className="flex items-center group-hover:translate-x-1 transition-transform duration-200 delay-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 group-hover:scale-150 transition-transform" />
                      Expand your supplier network
                    </li>
                  </ul>
                  <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 bg-transparent group-hover:bg-emerald-500 group-hover:text-white px-4 py-2 rounded-full transition-all duration-300">
                    Explore Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  );
}
