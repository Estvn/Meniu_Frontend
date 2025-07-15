import React from "react";

interface BillingIconProps {
  className?: string;
}

export const BillingIcon: React.FC<BillingIconProps> = ({ className = "" }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.4999 3.33325H2.49992C1.57944 3.33325 0.833252 4.07944 0.833252 4.99992V14.9999C0.833252 15.9204 1.57944 16.6666 2.49992 16.6666H17.4999C18.4204 16.6666 19.1666 15.9204 19.1666 14.9999V4.99992C19.1666 4.07944 18.4204 3.33325 17.4999 3.33325Z"
        stroke="#4B5563"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.833252 8.33325H19.1666"
        stroke="#4B5563"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
