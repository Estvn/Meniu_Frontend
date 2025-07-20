"use client";
import * as React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const baseClasses =
    "flex relative justify-center items-center px-3.5 py-2 rounded-md border-solid border-[0.839px] min-h-[30px] transition-colors";

  const variantClasses = {
    primary:
      "bg-orange-500 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600",
    secondary: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const handleClick = () => {
    console.log('Button clicked:', { type, disabled, children });
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      <span className="relative text-sm text-center">{children}</span>
    </button>
  );
}
