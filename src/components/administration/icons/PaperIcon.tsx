import React from "react";

interface PaperIconProps {
  className?: string;
}

export const PaperIcon: React.FC<PaperIconProps> = ({
  className = "",
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}; 