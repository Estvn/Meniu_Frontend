"use client";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4 shadow-sm bg-orange-500 h-16 sm:h-18 md:h-20">
      {/* Logo and Title Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Icon Container */}
        <div className="flex justify-center items-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white bg-opacity-20">
          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 21 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path 
                d="M5.70494 11.5582C4.8599 11.3768 4.11838 10.8742 3.63681 10.1565C3.15523 9.43877 2.97125 8.56208 3.12367 7.71133C3.27609 6.86057 3.753 6.10229 4.45379 5.59642C5.15458 5.09056 6.02447 4.87667 6.87994 4.99988C7.09046 4.52208 7.38706 4.08706 7.75494 3.71655C8.14198 3.32852 8.60178 3.02066 9.10799 2.81061C9.6142 2.60056 10.1569 2.49243 10.7049 2.49243C11.253 2.49243 11.7957 2.60056 12.3019 2.81061C12.8081 3.02066 13.2679 3.32852 13.6549 3.71655C14.0228 4.08706 14.3194 4.52208 14.5299 4.99988C15.3854 4.87667 16.2553 5.09056 16.9561 5.59642C17.6569 6.10229 18.1338 6.86057 18.2862 7.71133C18.4386 8.56208 18.2546 9.43877 17.7731 10.1565C17.2915 10.8742 16.55 11.3768 15.7049 11.5582V17.4999H5.70494V11.5582Z" 
                stroke="currentColor" 
                strokeOpacity="0.866667" 
                strokeWidth="1.66667" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M5.70496 14.1667H15.705" 
                stroke="currentColor" 
                strokeOpacity="0.866667" 
                strokeWidth="1.66667" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        
        {/* Title Section */}
        <div className="flex flex-col">
          <h1 className="text-base sm:text-lg md:text-xl font-bold leading-tight text-white">
            Menú
          </h1>
          <p className="text-xs sm:text-sm md:text-base leading-tight text-white text-opacity-90">
            Gestión de Menú
          </p>
        </div>
      </div>

      {/* Right Side - Profile Image */}
      <div className="flex items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a7fb1194bc7a7c5cc5ca717dfd93df6ce1be873?width=56"
          alt="Perfil de usuario"
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full shadow-sm object-cover border-2 border-white border-opacity-30"
        />
      </div>
    </header>
  );
}
