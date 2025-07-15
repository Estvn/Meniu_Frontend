import React from "react";

interface PaperIconWhiteProps {
  className?: string;
}

export const PaperIconWhite: React.FC<PaperIconWhiteProps> = ({
  className = "",
}) => {
  const strokeColor = "#fff";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={strokeColor} strokeWidth="2" fill="none" />
      <line x1="8" y1="6" x2="16" y2="6" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="10" x2="16" y2="10" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="14" x2="14" y2="14" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}; 