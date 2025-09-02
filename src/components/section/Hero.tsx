export default function Hero() {
  return (
    <div className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center"
          alt="Modern shopping experience"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60" />
      </div>

      {/* Content */}
      <div className="relative px-6 py-20 text-center sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-sm">
          <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400"></span>
          New Collection Available
        </div>

        {/* Main Heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          Discover Amazing
          <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Products
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
          Explore our curated collection of premium products designed to enhance
          your lifestyle with quality, innovation, and style that defines modern
          living.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-xl focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none">
            Shop Now
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          <button className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-600 bg-slate-800/50 px-8 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-slate-500 hover:bg-slate-700/50 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none">
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white sm:text-3xl">
              10K+
            </div>
            <div className="mt-1 text-sm text-slate-400">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white sm:text-3xl">5K+</div>
            <div className="mt-1 text-sm text-slate-400">Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white sm:text-3xl">4.9</div>
            <div className="mt-1 text-sm text-slate-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white sm:text-3xl">
              24/7
            </div>
            <div className="mt-1 text-sm text-slate-400">Support</div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl"></div>
    </div>
  );
}
