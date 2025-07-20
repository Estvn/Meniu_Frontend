import React from "react";

interface ChefHatIconProps {
  className?: string;
}

export const ChefHatIcon: React.FC<ChefHatIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M5.11009 12.0582C4.26505 11.8768 3.52354 11.3742 3.04196 10.6565C2.56038 9.93877 2.3764 9.06208 2.52882 8.21133C2.68124 7.36057 3.15815 6.60229 3.85894 6.09642C4.55974 5.59056 5.42962 5.37667 6.28509 5.49988C6.49561 5.02208 6.79221 4.58706 7.16009 4.21655C7.54713 3.82852 8.00693 3.52066 8.51314 3.31061C9.01935 3.10056 9.56203 2.99243 10.1101 2.99243C10.6581 2.99243 11.2008 3.10056 11.707 3.31061C12.2132 3.52066 12.673 3.82852 13.0601 4.21655C13.428 4.58706 13.7246 5.02208 13.9351 5.49988C14.7906 5.37667 15.6604 5.59056 16.3612 6.09642C17.062 6.60229 17.5389 7.36057 17.6914 8.21133C17.8438 9.06208 17.6598 9.93877 17.1782 10.6565C16.6966 11.3742 15.9551 11.8768 15.1101 12.0582V17.9999H5.11009V12.0582Z"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.11011 14.6667H15.1101"
        stroke="white"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
